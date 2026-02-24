package controller;

import dao.UserDAO;
import dto.UserDTO;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

// web.xml에 수동 등록했으므로 @WebServlet 어노테이션 제거
public class SignupServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("[SignupServlet] POST Request Received");
        
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        PrintWriter out = response.getWriter();
        
        try {
            String name = request.getParameter("name");
            String loginId = request.getParameter("loginId");
            String email = request.getParameter("email");
            String password = request.getParameter("password");

            // 디버깅용 (브라우저 응답에 포함되지 않음, 서버 콘솔 확인용)
            System.out.println("Signup Attempt - Name: " + name + ", ID: " + loginId);

            if (name == null || loginId == null || email == null || password == null || 
                name.isEmpty() || loginId.isEmpty() || email.isEmpty() || password.isEmpty()) {
                sendJsonResponse(out, response, HttpServletResponse.SC_BAD_REQUEST, false, "필수 항목이 누락되었습니다.");
                return;
            }

            UserDTO userDTO = new UserDTO();
            userDTO.setName(name);
            userDTO.setLoginId(loginId);
            userDTO.setEmail(email);
            userDTO.setPassword(password);

            UserDAO dao = new UserDAO();

            if (dao.checkEmailExists(userDTO.getEmail())) {
                sendJsonResponse(out, response, HttpServletResponse.SC_CONFLICT, false, "이미 사용 중인 이메일입니다.");
                return;
            }

            if (dao.insertUser(userDTO)) {
                sendJsonResponse(out, response, HttpServletResponse.SC_OK, true, "회원가입 완료.");
            } else {
                sendJsonResponse(out, response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, false, "데이터베이스 저장 실패.");
            }

        } catch (Throwable t) {
            // [CRITICAL] 모든 에러를 JSON으로 변환하여 프론트에서 확인할 수 있게 함
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
