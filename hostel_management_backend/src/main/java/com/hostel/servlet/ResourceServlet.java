package com.hostel.servlet;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.hostel.config.ApiUtil;
import com.hostel.config.DBConnection;
import com.hostel.config.ResourceConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.*;
import java.util.*;

@WebServlet(urlPatterns = {
    "/api/students", "/api/hostels", "/api/room-types", "/api/rooms",
    "/api/applications", "/api/allocations", "/api/payments"
})
public class ResourceServlet extends HttpServlet {
    private ResourceConfig config(HttpServletRequest req) {
        String path = req.getServletPath();
        String name = path.substring("/api/".length());
        return ResourceConfig.get(name);
    }

    @Override protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        resp.setHeader("Allow", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setStatus(204);
    }

    @Override protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ResourceConfig cfg = config(req);
        if (cfg == null) { ApiUtil.error(resp, 404, "Unknown resource"); return; }
        String id = req.getParameter("id");
        String q = req.getParameter("q");
        String sql = "SELECT " + String.join(", ", cfg.columns()) + " FROM " + cfg.table();
        List<Object> params = new ArrayList<>();
        if (id != null && !id.isBlank()) {
            sql += " WHERE " + cfg.primaryKey() + " = ?";
            params.add(id);
        } else if (q != null && !q.isBlank()) {
            List<String> searchable = cfg.columns().stream()
                .filter(c -> !c.endsWith("_ID") && !c.equals("CAPACITY") && !c.equals("AMOUNT") && !c.equals("FEE"))
                .toList();
            if (!searchable.isEmpty()) {
                sql += " WHERE " + String.join(" OR ", searchable.stream().map(c -> "LOWER(TO_CHAR(" + c + ")) LIKE LOWER(?)").toList());
                for (int i=0;i<searchable.size();i++) params.add("%" + q + "%");
            }
        }
        sql += " ORDER BY " + cfg.primaryKey() + " DESC";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            for (int i=0;i<params.size();i++) ps.setObject(i+1, params.get(i));
            try (ResultSet rs = ps.executeQuery()) {
                List<Map<String,Object>> rows = new ArrayList<>();
                ResultSetMetaData md = rs.getMetaData();
                while (rs.next()) {
                    Map<String,Object> row = new LinkedHashMap<>();
                    for (int i=1;i<=md.getColumnCount();i++) row.put(md.getColumnLabel(i).toLowerCase(), rs.getObject(i));
                    rows.add(row);
                }
                ApiUtil.json(resp, 200, rows);
            }
        } catch (SQLException e) { fail(resp, e); }
    }

    @Override protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ResourceConfig cfg = config(req);
        if (cfg == null) { ApiUtil.error(resp, 404, "Unknown resource"); return; }
        JsonObject body = ApiUtil.readJson(req);
        List<String> cols = cfg.columns().stream().filter(c -> body.has(c.toLowerCase()) || body.has(c)).toList();
        if (cols.isEmpty()) { ApiUtil.error(resp, 400, "Provide at least one recognized field in JSON."); return; }
        String sql = "INSERT INTO " + cfg.table() + " (" + String.join(", ", cols) + ") VALUES (" + String.join(", ", Collections.nCopies(cols.size(), "?")) + ")";
        try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
            bind(ps, body, cols);
            int changed = ps.executeUpdate();
            ApiUtil.json(resp, 201, Map.of("message", "Record created", "rowsAffected", changed));
        } catch (SQLException e) { fail(resp, e); }
    }

    @Override protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ResourceConfig cfg = config(req);
        if (cfg == null) { ApiUtil.error(resp, 404, "Unknown resource"); return; }
        String id = req.getParameter("id");
        if (id == null || id.isBlank()) { ApiUtil.error(resp, 400, "Use ?id=PRIMARY_KEY_VALUE"); return; }
        JsonObject body = ApiUtil.readJson(req);
        List<String> cols = cfg.columns().stream().filter(c -> !c.equals(cfg.primaryKey()) && (body.has(c.toLowerCase()) || body.has(c))).toList();
        if (cols.isEmpty()) { ApiUtil.error(resp, 400, "Provide fields to update."); return; }
        String sql = "UPDATE " + cfg.table() + " SET " + String.join(", ", cols.stream().map(c -> c + " = ?").toList()) + " WHERE " + cfg.primaryKey() + " = ?";
        try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
            bind(ps, body, cols); ps.setString(cols.size()+1, id);
            int changed = ps.executeUpdate();
            ApiUtil.json(resp, changed == 0 ? 404 : 200, Map.of("message", changed == 0 ? "Record not found" : "Record updated", "rowsAffected", changed));
        } catch (SQLException e) { fail(resp, e); }
    }

    @Override protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ResourceConfig cfg = config(req);
        if (cfg == null) { ApiUtil.error(resp, 404, "Unknown resource"); return; }
        String id = req.getParameter("id");
        if (id == null || id.isBlank()) { ApiUtil.error(resp, 400, "Use ?id=PRIMARY_KEY_VALUE"); return; }
        String sql = "DELETE FROM " + cfg.table() + " WHERE " + cfg.primaryKey() + " = ?";
        try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, id);
            int changed = ps.executeUpdate();
            ApiUtil.json(resp, changed == 0 ? 404 : 200, Map.of("message", changed == 0 ? "Record not found" : "Record deleted", "rowsAffected", changed));
        } catch (SQLException e) { fail(resp, e); }
    }

    private void bind(PreparedStatement ps, JsonObject body, List<String> cols) throws SQLException {
        for (int i=0;i<cols.size();i++) {
            String col = cols.get(i);
            JsonElement value = body.has(col.toLowerCase()) ? body.get(col.toLowerCase()) : body.get(col);
            if (value == null || value.isJsonNull()) ps.setNull(i+1, Types.NULL);
            else if (value.isJsonPrimitive() && value.getAsJsonPrimitive().isNumber()) ps.setBigDecimal(i+1, value.getAsBigDecimal());
            else ps.setString(i+1, value.getAsString());
        }
    }

    private void fail(HttpServletResponse resp, SQLException e) throws IOException {
        getServletContext().log("Database operation failed", e);
        String message = e.getErrorCode() == 1 ? "Duplicate value violates a unique constraint."
            : e.getErrorCode() == 2291 || e.getErrorCode() == 2292 ? "Related records prevent this operation. Check foreign-key relationships."
            : "Database operation failed. Check the Oracle table/column names and Tomcat logs.";
        ApiUtil.error(resp, 400, message);
    }
}
