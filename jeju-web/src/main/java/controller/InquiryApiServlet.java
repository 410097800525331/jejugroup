package controller;

import dao.InquiryDAO;
import dto.Inquiry;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.List;

public class InquiryApiServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        try (PrintWriter out = response.getWriter()) {
            InquiryDAO inquiryDAO = new InquiryDAO();
            List<Inquiry> inquiries = inquiryDAO.getAll();
            StringBuilder json = new StringBuilder();
            json.append("[");

            for (int i = 0; i < inquiries.size(); i++) {
                Inquiry inquiry = inquiries.get(i);
                if (i > 0) {
                    json.append(",");
                }

                json.append("{");
                json.append("\"id\":").append(inquiry.getId()).append(",");
                json.append("\"title\":\"").append(escapeJson(inquiry.getTitle())).append("\",");
                json.append("\"content\":\"").append(escapeJson(inquiry.getContent())).append("\",");
                json.append("\"service\":\"").append(escapeJson(inquiry.getService())).append("\",");
                json.append("\"status\":\"").append(escapeJson(inquiry.getStatus())).append("\",");
                json.append("\"createdAt\":\"")
                    .append(inquiry.getCreatedAt() == null ? "" : DATE_FORMAT.format(inquiry.getCreatedAt()))
                    .append("\"");
                json.append("}");
            }

            json.append("]");
            out.print(json.toString());
        } catch (Exception e) {
            throw new ServletException("Failed to load inquiries.", e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        String service = trim(request.getParameter("service"));
        String inquiryType = trim(request.getParameter("inquiryType"));
        String name = trim(request.getParameter("name"));
        String email = trim(request.getParameter("email"));
        String phone = trim(request.getParameter("phone"));
        String title = trim(request.getParameter("title"));
        String content = trim(request.getParameter("content"));

        try (PrintWriter out = response.getWriter()) {
            if (isBlank(service) || isBlank(title) || isBlank(content)) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\":false,\"message\":\"Missing required fields.\"}");
                return;
            }

            Inquiry inquiry = new Inquiry();
            inquiry.setService(service);
            inquiry.setTitle(title);
            inquiry.setContent(buildStoredContent(inquiryType, name, email, phone, content));
            inquiry.setStatus("pending");

            InquiryDAO inquiryDAO = new InquiryDAO();
            inquiryDAO.insert(inquiry);

            response.setStatus(HttpServletResponse.SC_CREATED);
            out.print("{\"success\":true}");
        } catch (Exception e) {
            throw new ServletException("Failed to create inquiry.", e);
        }
    }

    private String buildStoredContent(String inquiryType, String name, String email, String phone, String content) {
        StringBuilder builder = new StringBuilder();
        appendMeta(builder, "Type", inquiryType);
        appendMeta(builder, "Name", name);
        appendMeta(builder, "Email", email);
        appendMeta(builder, "Phone", phone);

        if (builder.length() > 0) {
            builder.append("\n");
        }

        builder.append(content == null ? "" : content);
        return builder.toString();
    }

    private void appendMeta(StringBuilder builder, String label, String value) {
        if (isBlank(value)) {
            return;
        }

        builder.append("[").append(label).append("] ").append(value).append("\n");
    }

    private boolean isBlank(String value) {
        return value == null || value.isEmpty();
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }

    private String escapeJson(String value) {
        if (value == null) {
            return "";
        }

        return value
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\r", "\\r")
            .replace("\n", "\\n");
    }
}
