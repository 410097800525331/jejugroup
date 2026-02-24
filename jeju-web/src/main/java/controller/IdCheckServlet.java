package controller;

import dao.UserDAO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * [ID 중복 확인 서블릿]
 * AJAX 요청을 받아 loginId의 중복 여부를 JSON으로 반환.
 */
public class IdCheckServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("[IdCheckServlet] Request Received: " + request.getQueryString());
        
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        PrintWriter out = response.getWriter();
        String loginId = request.getParameter("loginId");

        try {
            if (loginId == null || loginId.trim().isEmpty()) {
                sendJsonResponse(out, response, HttpServletResponse.SC_BAD_REQUEST, false, "아이디를 입력해주세요.");
                return;
            }

            UserDAO dao = new UserDAO();
            boolean exists = dao.checkIdExists(loginId);

            if (exists) {
                sendJsonResponse(out, response, HttpServletResponse.SC_OK, false, "이미 사용 중인 아이디입니다.");
            } else {
                sendJsonResponse(out, response, HttpServletResponse.SC_OK, true, "사용 가능한 아이디입니다.");
            }

        } catch (Throwable t) {
            t.printStackTrace();
            sendJsonResponse(out, response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, false, "서버 에러: " + t.getMessage());
        } finally {
            out.flush();
        }
    }

    private void sendJsonResponse(PrintWriter out, HttpServletResponse response, int status, boolean available, String message) {
        response.setStatus(status);
        out.print("{\"available\":" + available + ",\"message\":\"" + message + "\"}");
    }
}
