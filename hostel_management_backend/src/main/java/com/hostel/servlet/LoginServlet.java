package com.hostel.servlet;

import com.google.gson.JsonObject;
import com.hostel.config.ApiUtil;
import com.hostel.config.DBConnection;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.mindrot.jbcrypt.BCrypt;

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(
            HttpServletRequest req,
            HttpServletResponse resp) throws IOException {

        JsonObject body = ApiUtil.readJson(req);

        // Read username and password from the request
        String username = body.has("username")
                && !body.get("username").isJsonNull()
                ? body.get("username").getAsString().trim()
                : "";

        String password = body.has("password")
                && !body.get("password").isJsonNull()
                ? body.get("password").getAsString()
                : "";

        // Validate input
        if (username.isBlank() || password.isBlank()) {
            ApiUtil.error(
                    resp,
                    400,
                    "Username and password are required."
            );
            return;
        }

        // Match the actual Oracle USERS table
        String sql =
                "SELECT USER_ID, USERNAME, PASSWORD_HASH, ROLE " +
                "FROM USERS " +
                "WHERE LOWER(USERNAME) = LOWER(?) " +
                "AND IS_ACTIVE = 1";

        try (
            Connection con = DBConnection.getConnection();
            PreparedStatement ps = con.prepareStatement(sql)
        ) {
            ps.setString(1, username);

            try (ResultSet rs = ps.executeQuery()) {

                if (!rs.next()) {
                    ApiUtil.error(
                            resp,
                            401,
                            "Invalid username or password."
                    );
                    return;
                }

                String storedHash = rs.getString("PASSWORD_HASH");

                // Verify a BCrypt hash. Reject placeholders or other formats.
                boolean passwordMatches = false;

                if (storedHash != null
                        && storedHash.matches(
                            "\\$2[aby]\\$\\d{2}\\$[./A-Za-z0-9]{53}"
                        )) {
                    try {
                        passwordMatches =
                                BCrypt.checkpw(password, storedHash);
                    } catch (IllegalArgumentException ex) {
                        passwordMatches = false;
                    }
                }

                if (!passwordMatches) {
                    ApiUtil.error(
                            resp,
                            401,
                            "Invalid username or password."
                    );
                    return;
                }

                // Create a session after successful authentication
                HttpSession session = req.getSession(true);

                session.setAttribute(
                        "userId",
                        rs.getLong("USER_ID")
                );

                session.setAttribute(
                        "username",
                        rs.getString("USERNAME")
                );

                session.setAttribute(
                        "userRole",
                        rs.getString("ROLE")
                );

                session.setMaxInactiveInterval(30 * 60);

                // Send a successful response without exposing the hash
                JsonObject result = new JsonObject();
                result.addProperty("success", true);
                result.addProperty(
                        "message",
                        "Login successful."
                );
                result.addProperty(
                        "username",
                        rs.getString("USERNAME")
                );
                result.addProperty(
                        "role",
                        rs.getString("ROLE")
                );

                ApiUtil.json(resp, 200, result);
            }

        } catch (SQLException e) {
            getServletContext().log(
                    "Login database query failed",
                    e
            );

            ApiUtil.error(
                    resp,
                    503,
                    "Login service unavailable. Check the database connection."
            );
        }
    }
}
