package com.hostel.servlet;

import com.hostel.config.ApiUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;

@WebServlet("/api/logout")
public class LogoutServlet extends HttpServlet {
    @Override protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        if (session != null) session.invalidate();
        ApiUtil.json(resp, 200, Map.of("message", "Logged out"));
    }
}
