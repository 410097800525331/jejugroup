package controller;

import dao.InquiryDAO;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class InquiryListServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        try {
            InquiryDAO inquiryDAO = new InquiryDAO();
            request.setAttribute("inquiryList", inquiryDAO.getAll());
            request.getRequestDispatcher("/pages/cs/inquiry_list.jsp").forward(request, response);
        } catch (Exception e) {
            throw new ServletException("문의 목록을 조회하는 중 오류가 발생했습니다.", e);
        }
    }
}
