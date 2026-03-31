package controller;

import util.EnvLoader;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class PublicConfigServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        response.setHeader("Pragma", "no-cache");

        String naverClientId = safe(EnvLoader.get("NAVER_CLIENT_ID"));
        String kakaoJsKey = safe(EnvLoader.get("KAKAO_JS_KEY"));

        PrintWriter out = response.getWriter();
        out.print(
            "{\"success\":true,\"social\":{" +
            "\"naverClientId\":\"" + escapeJson(naverClientId) + "\"," +
            "\"kakaoJsKey\":\"" + escapeJson(kakaoJsKey) + "\"" +
            "}}"
        );
        out.flush();
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private String escapeJson(String value) {
        String escaped = value.replace("\\", "\\\\");
        escaped = escaped.replace("\"", "\\\"");
        escaped = escaped.replace("\r", "\\r");
        escaped = escaped.replace("\n", "\\n");
        return escaped;
    }
}
