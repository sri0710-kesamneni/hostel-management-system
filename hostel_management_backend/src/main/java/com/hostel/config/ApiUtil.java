package com.hostel.config;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public final class ApiUtil {
    public static final Gson GSON = new Gson();
    private ApiUtil() {}

    public static JsonObject readJson(jakarta.servlet.http.HttpServletRequest req) throws IOException {
        return GSON.fromJson(req.getReader(), JsonObject.class);
    }

    public static void json(HttpServletResponse resp, int status, Object body) throws IOException {
        resp.setStatus(status);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(GSON.toJson(body));
    }

    public static void error(HttpServletResponse resp, int status, String message) throws IOException {
        JsonObject result = new JsonObject();
        result.addProperty("error", message);
        json(resp, status, result);
    }
}
