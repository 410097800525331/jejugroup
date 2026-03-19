package controller;

import dao.InquiryDAO;
import dto.InquiryDTO;
import util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@WebServlet("/inquiry/write")
public class InquiryWriteServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String DEFAULT_STATUS = "pending";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy.MM.dd");

    private final InquiryDAO inquiryDAO = new InquiryDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        try {
            String rawBody = JsonUtil.readBody(request);
            String title = JsonUtil.extractRequestValue(request, rawBody, "title");
            String content = JsonUtil.extractRequestValue(request, rawBody, "content");
            String service = JsonUtil.extractRequestValue(request, rawBody, "service");

            if (title == null || content == null || service == null) {
                JsonUtil.writeJson(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "{\"success\":false,\"message\":\"title, content, service are required.\"}"
                );
                return;
            }

            InquiryDTO inquiry = new InquiryDTO();
            inquiry.setTitle(title);
            inquiry.setContent(content);
            inquiry.setService(service);
            inquiry.setStatus(DEFAULT_STATUS);
            inquiry.setCreatedAt(LocalDate.now().format(DATE_FORMATTER));

            long inquiryId = inquiryDAO.insertInquiry(inquiry);
            inquiry.setId(inquiryId);

            JsonUtil.writeJson(
                response,
                HttpServletResponse.SC_CREATED,
                "{\"success\":true,\"message\":\"Inquiry created successfully.\",\"inquiry\":" + toInquiryJson(inquiry) + "}"
            );
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.writeJson(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                "{\"success\":false,\"message\":\"Failed to create inquiry.\"}"
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
