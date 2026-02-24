package controller;

import dao.UserDAO;
import dto.UserDTO;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

// web.xml에 수동 등록했으므로 @WebServlet 어노테이션 제거
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        PrintWriter out = response.getWriter();
        
        try {
            String email = request.getParameter("email");
            String password = request.getParameter("password");

            // 디버깅용
            System.out.println("Login Attempt - Email: " + email);

            if (email == null || password == null || email.isEmpty() || password.isEmpty()) {
                sendJsonResponse(out, response, HttpServletResponse.SC_BAD_REQUEST, false, "이메일과 비밀번호를 입력해주세요.");
                return;
            }

            UserDAO dao = new UserDAO();
            UserDTO user = dao.loginUser(email, password);

            if (user != null) {
                HttpSession session = request.getSession();
                session.setAttribute("user", user);

                StringBuilder json = new StringBuilder();
                json.append("{");
                json.append("\"success\":true,");
                json.append("\"message\":\"로그인 성공\",");
                json.append("\"user\": {");
                json.append("\"loginId\":\"").append(user.getLoginId()).append("\",");
                json.append("\"name\":\"").append(user.getName()).append("\",");
                json.append("\"role\":\"").append(user.getRole()).append("\"");
                json.append("}");
                json.append("}");

                response.setStatus(HttpServletResponse.SC_OK);
                out.print(json.toString());
            } else {
                sendJsonResponse(out, response, HttpServletResponse.SC_UNAUTHORIZED, false, "이메일 또는 비밀번호가 일치하지 않습니다.");
            }

        } catch (Throwable t) {
            t.printStackTrace();
            String errorMsg = t.getClass().getSimpleName() + ": " + t.getMessage();
            sendJsonResponse(out, response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, false, "서버 내부 에러: " + errorMsg);
        } finally {
            out.flush();
        }
    }

    private void sendJsonResponse(PrintWriter out, HttpServletResponse response, int status, boolean success, String message) {
        response.setStatus(status);
        out.print("{\"success\":" + success + ",\"message\":\"" + message + "\"}");
    }
}
