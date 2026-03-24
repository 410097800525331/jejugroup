package controller;

import dao.UserDAO;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.net.HttpURLConnection;
import java.net.URL;

import util.EnvLoader;

public class VerifyController extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private static final String RECAPTCHA_TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
    private static final String RECAPTCHA_TEST_SECRET_KEY = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        String key = EnvLoader.get("RECAPTCHA_SITE_KEY");
        if (key == null || key.isEmpty()) {
            // 운영 키 누락 시에도 화면이 완전히 죽지 않도록 테스트 키 사용
            key = RECAPTCHA_TEST_SITE_KEY;
            System.out.println("[VerifyController] WARNING: RECAPTCHA_SITE_KEY missing. Using Google test site key.");
        }

        response.getWriter().print("{\"success\":true,\"siteKey\":\"" + key + "\"}");
    }

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
                    String phone = request.getParameter("phone");
                    if (phone == null || phone.trim().isEmpty()) {
                        sendJsonResponse(out, response, HttpServletResponse.SC_BAD_REQUEST, false, "휴대폰 번호를 입력해주세요.");
                        return;
                    }
                    if (dao.checkPhoneExists(phone)) {
                        sendJsonResponse(out, response, HttpServletResponse.SC_CONFLICT, false, "이미 해당 번호로 가입된 계정이 존재합니다.");
                    } else {
                        sendJsonResponse(out, response, HttpServletResponse.SC_OK, true, "인증이 완료되었습니다. (Simulation)");
                    }
                    break;

                case "verifyRecaptcha":
                    String token = request.getParameter("token");
                    if (token == null || token.trim().isEmpty()) {
                        sendJsonResponse(out, response, HttpServletResponse.SC_BAD_REQUEST, false, "토큰이 누락되었습니다.");
                        return;
                    }

                    String secretKey = EnvLoader.get("RECAPTCHA_SECRET_KEY");
                    if (secretKey == null || secretKey.isEmpty()) {
                        // 운영 키 누락 시 테스트 시크릿 사용
                        secretKey = RECAPTCHA_TEST_SECRET_KEY;
                        System.out.println("[VerifyController] WARNING: RECAPTCHA_SECRET_KEY missing. Using Google test secret key.");
                    }

                    boolean isRecaptchaValid = verifyWithGoogle(secretKey, token);
                    if (isRecaptchaValid) {
                        sendJsonResponse(out, response, HttpServletResponse.SC_OK, true, "reCAPTCHA 인증 성공");
                    } else {
                        sendJsonResponse(out, response, HttpServletResponse.SC_BAD_REQUEST, false, "reCAPTCHA 인증 실패");
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

    private boolean verifyWithGoogle(String secret, String responseToken) {
        try {
            String urlStr = "https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + responseToken;
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");

            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuilder responseBuilder = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                responseBuilder.append(inputLine);
            }
            in.close();

            String jsonResponse = responseBuilder.toString();
            return jsonResponse.contains("\"success\": true") || jsonResponse.contains("\"success\":true");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
