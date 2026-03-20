package controller;

import dao.InquiryDAO;
import dto.Inquiry;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class InquiryDetailServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        String idParam = request.getParameter("id");
        int inquiryId;

        try {
            inquiryId = Integer.parseInt(idParam);
        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "올바르지 않은 문의 번호입니다.");
            return;
        }

        try {
            InquiryDAO inquiryDAO = new InquiryDAO();
            Inquiry inquiry = inquiryDAO.getById(inquiryId);

            if (inquiry == null) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "문의글을 찾을 수 없습니다.");
                return;
            }

            request.setAttribute("inquiry", inquiry);
            request.getRequestDispatcher("/pages/cs/inquiry_detail.jsp").forward(request, response);
        } catch (Exception e) {
            throw new ServletException("문의 상세 조회 중 오류가 발생했습니다.", e);
        }
    }
}
