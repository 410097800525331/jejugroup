package controller;

import util.ConfigReader;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;

@WebServlet("/api/weather")
public class WeatherController extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        // CORS Setup
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET");
        
        String apiKey = ConfigReader.get("OPENWEATHER_API_KEY");
        if (apiKey == null || apiKey.isEmpty()) {
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "API key configuration missing");
            return;
        }

        String type = request.getParameter("type");
        String finalUrlStr = "";

        if ("search".equals(type)) {
            String q = request.getParameter("q");
            if (q == null || q.isEmpty()) {
                sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Missing query parameter 'q'");
                return;
            }
            finalUrlStr = "https://api.openweathermap.org/data/2.5/weather?q=" + q + "&units=metric&lang=kr&appid=" + apiKey;
            
        } else if ("current".equals(type)) {
            String lat = request.getParameter("lat");
            String lon = request.getParameter("lon");
            if (lat == null || lon == null) {
                sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Missing coordinates 'lat' or 'lon'");
                return;
            }
            finalUrlStr = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&lang=kr&appid=" + apiKey;
            
        } else if ("pollution".equals(type)) {
            String lat = request.getParameter("lat");
            String lon = request.getParameter("lon");
            if (lat == null || lon == null) {
                sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Missing coordinates 'lat' or 'lon'");
                return;
            }
            finalUrlStr = "https://api.openweathermap.org/data/2.5/air_pollution?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
        } else {
            sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid type parameter");
            return;
        }

        try {
            URL url = new URL(finalUrlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000); // 5 seconds
            conn.setReadTimeout(5000);

            int status = conn.getResponseCode();

            BufferedReader in;
            if (status >= 200 && status < 300) {
                in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            } else {
                in = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "UTF-8"));
                response.setStatus(status);
            }

            StringBuilder content = new StringBuilder();
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            conn.disconnect();

            PrintWriter out = response.getWriter();
            out.print(content.toString());
            out.flush();

        } catch (Exception e) {
            e.printStackTrace();
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to connect to weather service");
        }
    }

    private void sendError(HttpServletResponse response, int status, String msg) throws IOException {
        response.setStatus(status);
        PrintWriter out = response.getWriter();
        out.print("{\"error\":\"" + msg + "\"}");
        out.flush();
    }
}
