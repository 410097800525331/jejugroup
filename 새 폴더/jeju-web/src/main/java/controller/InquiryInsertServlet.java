package controller;

import dao.InquiryDAO;
import dto.Inquiry;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class InquiryInsertServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        String title = trim(request.getParameter("title"));
        String service = trim(request.getParameter("service"));
        String content = trim(request.getParameter("content"));

        if (isBlank(title) || isBlank(service) || isBlank(content)) {
            request.setAttribute("errorMessage", "서비스, 제목, 내용을 모두 입력해주세요.");
            request.setAttribute("formTitle", title);
            request.setAttribute("formService", service);
            request.setAttribute("formContent", content);
            request.getRequestDispatcher("/pages/cs/inquiry_write.jsp").forward(request, response);
            return;
        }

        Inquiry inquiry = new Inquiry();
        inquiry.setTitle(title);
        inquiry.setService(service);
        inquiry.setContent(content);
        inquiry.setStatus("접수");

        try {
            InquiryDAO inquiryDAO = new InquiryDAO();
            inquiryDAO.insert(inquiry);
            response.sendRedirect(request.getContextPath() + "/inquiry/list");
        } catch (Exception e) {
            throw new ServletException("문의 등록 중 오류가 발생했습니다.", e);
        }
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.isEmpty();
    }
}
