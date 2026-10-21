
package com.hostel.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public final class DBConnection {

    private DBConnection() {
        // Prevent object creation
    }

    public static Connection getConnection() throws SQLException {
        // Load the Oracle JDBC driver explicitly
        try {
            Class.forName("oracle.jdbc.OracleDriver");
        } catch (ClassNotFoundException e) {
            throw new SQLException(
                "Oracle JDBC driver not found. Check the ojdbc11 dependency.",
                e
            );
        }

        // Read database connection settings
        String url = System.getenv().getOrDefault(
            "HOSTEL_DB_URL",
            "jdbc:oracle:thin:@//localhost:1521/XE"
        );

        String user = System.getenv("HOSTEL_DB_USER");
        String password = "[REDACTED]";

        // Validate credentials
        if (user == null || user.isBlank()
                || password == null || password.isBlank()) {
            throw new SQLException(
                "Set HOSTEL_DB_USER and HOSTEL_DB_PASSWORD first."
            );
        }

        // Establish and return the database connection
        return DriverManager.getConnection(url, user, password);
    }
}
