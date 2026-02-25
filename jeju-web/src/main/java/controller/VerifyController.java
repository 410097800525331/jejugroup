package controller;

import dao.UserDAO;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Random;

public class VerifyController extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        String action = request.getParameter("action");
        PrintWriter out = response.getWriter();

        if (action == null || action.isEmpty()) {
            sendJsonResponse(out, response, HttpServletResponse.SC_BAD_REQUEST, false, "액션 코드가 누락되었습니다.");
            return;
        }

        UserDAO dao = new UserDAO();

        try {
            switch (action) {
                case "checkId":
                    String id = request.getParameter("id");
                    if (id == null || id.trim().isEmpty()) {
                        sendJsonResponse(out, response, HttpServletResponse.SC_BAD_REQUEST, false, "아이디를 입력해주세요.");
                        return;
                    }
                    if (dao.checkIdExists(id)) {
                        sendJsonResponse(out, response, HttpServletResponse.SC_CONFLICT, false, "이미 존재하는 아이디입니다.");
                    } else {
                        sendJsonResponse(out, response, HttpServletResponse.SC_OK, true, "사용 가능한 아이디입니다.");
                    }
                    break;
                    
                case "checkPhone":
                    // Simulaton of PASS authentication success check
                    String phone = request.getParameter("phone");
                    if (phone == null || phone.trim().isEmpty()) {
                        sendJsonResponse(out, response, HttpServletResponse.SC_BAD_REQUEST, false, "휴대폰 번호를 입력해주세요.");
                        return;
                    }
                    if (dao.checkPhoneExists(phone)) {
                        sendJsonResponse(out, response, HttpServletResponse.SC_CONFLICT, false, "이미 해당 번호로 가입된 계정이 존재합니다.");
                    } else {
                        // In reality, this would initiate a PASS API call. For now, simulate success.
                        sendJsonResponse(out, response, HttpServletResponse.SC_OK, true, "인증이 완료되었습니다. (Simulation)");
                    }
                    break;


                default:
                    sendJsonResponse(out, response, HttpServletResponse.SC_BAD_REQUEST, false, "잘못된 요청입니다.");
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendJsonResponse(out, response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, false, "서버 내부 오류가 발생했습니다.");
        } finally {
            out.flush();
        }
    }

    private void sendJsonResponse(PrintWriter out, HttpServletResponse response, int status, boolean success, String message) {
        response.setStatus(status);
        out.print("{\"success\":" + success + ",\"message\":\"" + message + "\"}");
    }
}
