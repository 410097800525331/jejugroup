package controller;

import dao.InquiryDAO;
import util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class InquiryDeleteServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final InquiryDAO inquiryDAO = new InquiryDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        try {
            String rawBody = JsonUtil.readBody(request);
            String inquiryId = JsonUtil.extractRequestValue(request, rawBody, "id");

            if (inquiryId == null) {
                JsonUtil.writeJson(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "{\"success\":false,\"message\":\"id is required.\"}"
                );
                return;
            }

            boolean deleted = inquiryDAO.deleteInquiry(Long.parseLong(inquiryId));
            if (!deleted) {
                JsonUtil.writeJson(
                    response,
                    HttpServletResponse.SC_NOT_FOUND,
                    "{\"success\":false,\"message\":\"Inquiry not found.\"}"
                );
                return;
            }

            JsonUtil.writeJson(
                response,
                HttpServletResponse.SC_OK,
                "{\"success\":true,\"message\":\"Inquiry deleted successfully.\"}"
            );
        } catch (NumberFormatException e) {
            JsonUtil.writeJson(
                response,
                HttpServletResponse.SC_BAD_REQUEST,
                "{\"success\":false,\"message\":\"id must be numeric.\"}"
            );
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.writeJson(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                "{\"success\":false,\"message\":\"Failed to delete inquiry.\"}"
            );
        }
    }
}
