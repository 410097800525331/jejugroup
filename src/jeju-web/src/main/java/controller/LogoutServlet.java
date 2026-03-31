package controller;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

public class LogoutServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        PrintWriter out = response.getWriter();
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }

            response.setStatus(HttpServletResponse.SC_OK);
            out.print("{\"success\":true,\"message\":\"로그아웃 완료\"}");
        } finally {
            out.flush();
        }
    }
}
