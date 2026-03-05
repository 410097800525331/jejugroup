package controller;

import dto.UserDTO;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

public class SessionServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        PrintWriter out = response.getWriter();
        try {
            HttpSession session = request.getSession(false);
            Object sessionUser = session != null ? session.getAttribute("user") : null;

            if (!(sessionUser instanceof UserDTO)) {
                sendJsonResponse(out, response, HttpServletResponse.SC_UNAUTHORIZED, false, "유효한 로그인 세션이 없습니다.");
                return;
            }

            UserDTO user = (UserDTO) sessionUser;
            StringBuilder json = new StringBuilder();
            json.append("{");
            json.append("\"success\":true,");
            json.append("\"user\":{");
            json.append("\"id\":\"").append(escapeJson(user.getId())).append("\",");
            json.append("\"name\":\"").append(escapeJson(user.getName())).append("\",");
            json.append("\"role\":\"").append(escapeJson(user.getRole())).append("\"");
            json.append("}");
            json.append("}");

            response.setStatus(HttpServletResponse.SC_OK);
            out.print(json.toString());
        } finally {
            out.flush();
        }
    }

    private void sendJsonResponse(PrintWriter out, HttpServletResponse response, int status, boolean success, String message) {
        response.setStatus(status);
        out.print("{\"success\":" + success + ",\"message\":\"" + escapeJson(message) + "\"}");
    }

    private String escapeJson(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
