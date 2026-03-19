package controller;

import dao.InquiryDAO;
import dto.InquiryDTO;
import util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class InquiryDetailServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final InquiryDAO inquiryDAO = new InquiryDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        try {
            String inquiryId = request.getParameter("id");
            if (inquiryId == null || inquiryId.trim().isEmpty()) {
                JsonUtil.writeJson(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "{\"success\":false,\"message\":\"id is required.\"}"
                );
                return;
            }

            InquiryDTO inquiry = inquiryDAO.findById(Long.parseLong(inquiryId));
            if (inquiry == null) {
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
                "{\"success\":true,\"inquiry\":" + toInquiryJson(inquiry) + "}"
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
                "{\"success\":false,\"message\":\"Failed to load inquiry.\"}"
            );
        }
    }

    private String toInquiryJson(InquiryDTO inquiry) {
        return "{"
            + "\"id\":" + inquiry.getId() + ","
            + "\"title\":" + JsonUtil.quote(inquiry.getTitle()) + ","
            + "\"content\":" + JsonUtil.quote(inquiry.getContent()) + ","
            + "\"service\":" + JsonUtil.quote(inquiry.getService()) + ","
            + "\"status\":" + JsonUtil.quote(inquiry.getStatus()) + ","
            + "\"date\":" + JsonUtil.quote(inquiry.getCreatedAt())
            + "}";
    }
}
