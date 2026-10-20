package com.hostel.servlet;

import com.hostel.config.ApiUtil;
import com.hostel.config.DBConnection;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

@WebServlet("/api/health")
public class HealthServlet extends HttpServlet {

    @Override
    protected void doGet(
            HttpServletRequest req,
            HttpServletResponse resp) throws IOException {

        try (Connection connection = DBConnection.getConnection()) {

            if (connection == null || !connection.isValid(5)) {
                ApiUtil.error(
                        resp,
                        HttpServletResponse.SC_SERVICE_UNAVAILABLE,
                        "Oracle database connection is not valid."
                );
                return;
            }

            ApiUtil.json(
                    resp,
                    HttpServletResponse.SC_OK,
                    Map.of(
                            "status", "ok",
                            "api", "running",
                            "database", "connected"
                    )
            );

        } catch (SQLException e) {

            getServletContext().log(
                    "Oracle database health check failed",
                    e
            );

            ApiUtil.error(
                    resp,
                    HttpServletResponse.SC_SERVICE_UNAVAILABLE,
                    "Database connection failed. Check the Tomcat logs."
            );

        } catch (Exception e) {

            getServletContext().log(
                    "Unexpected health check error",
                    e
            );

            ApiUtil.error(
                    resp,
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Unexpected server error."
            );
        }
    }
}
