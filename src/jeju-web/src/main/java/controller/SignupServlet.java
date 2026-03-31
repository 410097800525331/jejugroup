package controller;

import dao.UserDAO;
import dto.UserDTO;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.regex.Pattern;

public class SignupServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        PrintWriter out = response.getWriter();

        try {
            String phone = request.getParameter("phone");
            String name = request.getParameter("name");
            String id = request.getParameter("id");
            String pw = request.getParameter("pw");
            String provider = request.getParameter("provider");
            String email = request.getParameter("email");
            String birthDateInput = request.getParameter("birthDate"); // yy-mm-dd
            String rrnBackFirstDigit = request.getParameter("rrnBackFirstDigit");

            if (isBlank(phone) || isBlank(name) || isBlank(id) || isBlank(pw) || isBlank(email) || isBlank(birthDateInput) || isBlank(rrnBackFirstDigit)) {
                sendJsonResponse(out, response, HttpServletResponse.SC_BAD_REQUEST, false, "Required fields missing");
                return;
            }

            if (!EMAIL_PATTERN.matcher(email).matches()) {
                sendJsonResponse(out, response, HttpServletResponse.SC_BAD_REQUEST, false, "Invalid email format");
                return;
            }

            char rrnDigit = rrnBackFirstDigit.charAt(0);
            if (!isValidRrnBackFirstDigit(rrnDigit)) {
                sendJsonResponse(out, response, HttpServletResponse.SC_BAD_REQUEST, false, "rrnBackFirstDigit must be 1-8");
                return;
            }

            String normalizedBirthDate = normalizeBirthDate(birthDateInput, rrnDigit);
            if (normalizedBirthDate == null) {
                sendJsonResponse(out, response, HttpServletResponse.SC_BAD_REQUEST, false, "birthDate must be yy-mm-dd");
                return;
            }

            String normalizedGender = deriveGenderByRrnFirstDigit(rrnDigit);

            UserDTO userDTO = new UserDTO();
            userDTO.setPhone(phone);
            userDTO.setName(name);
            userDTO.setId(id);
            userDTO.setPw(util.BCryptUtil.hashPassword(pw));
            userDTO.setEmail(email);
            userDTO.setBirthDate(normalizedBirthDate);
            userDTO.setGender(normalizedGender);
            userDTO.setProvider(isBlank(provider) ? "PASS" : provider);

            UserDAO dao = new UserDAO();

            if (dao.checkIdExists(userDTO.getId())) {
                sendJsonResponse(out, response, HttpServletResponse.SC_CONFLICT, false, "ID already exists");
                return;
            }

            if (dao.checkPhoneExists(userDTO.getPhone())) {
                sendJsonResponse(out, response, HttpServletResponse.SC_CONFLICT, false, "Phone already exists");
                return;
            }

            if (dao.checkEmailExists(userDTO.getEmail())) {
                sendJsonResponse(out, response, HttpServletResponse.SC_CONFLICT, false, "Email already exists");
                return;
            }

            if (dao.insertUser(userDTO)) {
                sendJsonResponse(out, response, HttpServletResponse.SC_OK, true, "Signup completed");
            } else {
                sendJsonResponse(out, response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, false, "Failed to save user");
            }

        } catch (Throwable t) {
            t.printStackTrace();
            sendJsonResponse(out, response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, false, "Internal server error");
        } finally {
            out.flush();
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private void sendJsonResponse(PrintWriter out, HttpServletResponse response, int status, boolean success, String message) {
        response.setStatus(status);
        out.print("{\"success\":" + success + ",\"message\":\"" + message + "\"}");
    }

    // 1,3,5,7: male / 2,4,6,8: female
    private String deriveGenderByRrnFirstDigit(char digit) {
        if (digit == '1' || digit == '3' || digit == '5' || digit == '7') {
            return "M";
        }
        return "F";
    }

    // validate RRN first digit range
    private boolean isValidRrnBackFirstDigit(char digit) {
        return digit >= '1' && digit <= '8';
    }

    // 1,2,5,6 => 1900s / 3,4,7,8 => 2000s
    private String normalizeBirthDate(String birthDateInput, char rrnDigit) {
        String digits = birthDateInput.replaceAll("[^0-9]", "");
        if (digits.length() != 6) {
            return null;
        }

        try {
            int yy = Integer.parseInt(digits.substring(0, 2));
            int mm = Integer.parseInt(digits.substring(2, 4));
            int dd = Integer.parseInt(digits.substring(4, 6));

            int century = (rrnDigit == '1' || rrnDigit == '2' || rrnDigit == '5' || rrnDigit == '6') ? 1900 : 2000;
            int fullYear = century + yy;

            LocalDate birthDate = LocalDate.of(fullYear, mm, dd);
            return birthDate.toString(); // yyyy-mm-dd
        } catch (DateTimeException | NumberFormatException e) {
            return null;
        }
    }
}