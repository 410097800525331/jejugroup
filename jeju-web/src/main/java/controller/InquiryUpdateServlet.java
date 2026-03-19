package controller;

import dao.InquiryDAO;
import dto.InquiryDTO;
import util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class InquiryUpdateServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final InquiryDAO inquiryDAO = new InquiryDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        try {
            String rawBody = JsonUtil.readBody(request);
            String inquiryId = JsonUtil.extractRequestValue(request, rawBody, "id");
            String title = JsonUtil.extractRequestValue(request, rawBody, "title");
            String content = JsonUtil.extractRequestValue(request, rawBody, "content");
            String service = JsonUtil.extractRequestValue(request, rawBody, "service");

            if (inquiryId == null || title == null || content == null || service == null) {
                JsonUtil.writeJson(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "{\"success\":false,\"message\":\"id, title, content, service are required.\"}"
                );
                return;
            }

            InquiryDTO existing = inquiryDAO.findById(Long.parseLong(inquiryId));
            if (existing == null) {
                JsonUtil.writeJson(
                    response,
                    HttpServletResponse.SC_NOT_FOUND,
                    "{\"success\":false,\"message\":\"Inquiry not found.\"}"
                );
                return;
            }

            existing.setTitle(title);
            existing.setContent(content);
            existing.setService(service);

            boolean updated = inquiryDAO.updateInquiry(existing);
            if (!updated) {
                JsonUtil.writeJson(
                    response,
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "{\"success\":false,\"message\":\"Failed to update inquiry.\"}"
                );
                return;
            }

            InquiryDTO inquiry = inquiryDAO.findById(existing.getId());
            JsonUtil.writeJson(
                response,
                HttpServletResponse.SC_OK,
                "{\"success\":true,\"message\":\"Inquiry updated successfully.\",\"inquiry\":" + toInquiryJson(inquiry) + "}"
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
                "{\"success\":false,\"message\":\"Failed to update inquiry.\"}"
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
