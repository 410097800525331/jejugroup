package controller;

import dao.InquiryDAO;
import dto.InquiryDTO;
import util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class InquiryListServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final InquiryDAO inquiryDAO = new InquiryDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        try {
            List<InquiryDTO> inquiries = inquiryDAO.findAll();
            StringBuilder json = new StringBuilder();
            json.append("{\"success\":true,\"inquiries\":[");

            for (int index = 0; index < inquiries.size(); index++) {
                if (index > 0) {
                    json.append(",");
                }
                json.append(toInquiryJson(inquiries.get(index)));
            }

            json.append("]}");
            JsonUtil.writeJson(response, HttpServletResponse.SC_OK, json.toString());
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.writeJson(
                response,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                "{\"success\":false,\"message\":\"Failed to load inquiries.\"}"
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
