package controller;

import dao.UserDAO;
import dto.UserDTO;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class SignupServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("[SignupServlet] POST Request Received for Member Schema");
        
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        PrintWriter out = response.getWriter();
        
        try {
            // Extract the exact 9 columns specified by the new architecture
            String phone = request.getParameter("phone");
            String name = request.getParameter("name");
            String gender = request.getParameter("gender");
            String id = request.getParameter("id");
            String pw = request.getParameter("pw");
            String provider = request.getParameter("provider");

            System.out.println("Signup Attempt - Name: " + name + ", ID: " + id + ", Phone: " + phone);

            // Strict Validation against entirely empty payloads or missing required fields
            if (phone == null || name == null || gender == null || id == null || pw == null || provider == null ||
                phone.isEmpty() || name.isEmpty() || gender.isEmpty() || id.isEmpty() || pw.isEmpty() || provider.isEmpty()) {
                
                sendJsonResponse(out, response, HttpServletResponse.SC_BAD_REQUEST, false, "모든 필수 항목을 입력해주세요.");
                return;
            }

            UserDTO userDTO = new UserDTO();
            userDTO.setPhone(phone);
            userDTO.setName(name);
            userDTO.setGender(gender);
            userDTO.setId(id);
            userDTO.setPw(pw);
            userDTO.setProvider(provider);

            UserDAO dao = new UserDAO();

            // Check if ID is already registered (even though UI should pre-check, server must defend)
            if (dao.checkIdExists(userDTO.getId())) {
                sendJsonResponse(out, response, HttpServletResponse.SC_CONFLICT, false, "이미 사용 중인 아이디입니다.");
                return;
            }

            // Check if Phone is already registered (PASS 1-account-per-person policy)
            if (dao.checkPhoneExists(userDTO.getPhone())) {
                sendJsonResponse(out, response, HttpServletResponse.SC_CONFLICT, false, "이미 해당 번호로 가입된 계정이 존재합니다.");
                return;
            }
            

            // Execute DB Insertion
            if (dao.insertUser(userDTO)) {
                sendJsonResponse(out, response, HttpServletResponse.SC_OK, true, "회원가입이 성공적으로 완료되었습니다.");
            } else {
                sendJsonResponse(out, response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, false, "회원 정보 저장에 실패했습니다.");
            }

        } catch (Throwable t) {
            t.printStackTrace();
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
