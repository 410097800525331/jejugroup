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
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;

@WebServlet("/api/chat")
public class ChatbotController extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        // CORS Setup
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        
        String apiKey = ConfigReader.get("OPENAI_API_KEY");
        if (apiKey == null || apiKey.isEmpty()) {
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "API key configuration missing");
            return;
        }

        StringBuilder requestBody = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                requestBody.append(line);
            }
        }

        if (requestBody.length() == 0) {
             sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Empty request body");
             return;
        }

        // Extremely naive pass-through to OpenAI
        // Assuming the front sends: {"messages":[{"role":"system","content":"..."}, {"role":"user","content":"..."}]}
        // We inject the model wrapper
        
        String payloadJSONStr = requestBody.toString();
        // Super basic JSON manipulation (Usually use Gson/Jackson, but keeping it dependency-free here for Servlet prototype)
        if (!payloadJSONStr.contains("\"model\"")) {
             payloadJSONStr = "{\"model\": \"gpt-4o-mini\", \"temperature\": 0.7, \"max_tokens\": 300, \"messages\": " + 
                              payloadJSONStr.substring(payloadJSONStr.indexOf("\"messages\":") + 11, payloadJSONStr.lastIndexOf("]")) + "]}";
        }


        try {
            URL url = new URL("https://api.openai.com/v1/chat/completions");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Authorization", "Bearer " + apiKey);
            conn.setDoOutput(true);
            conn.setConnectTimeout(8000); 
            conn.setReadTimeout(12000);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = payloadJSONStr.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

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
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to connect to AI service: " + e.getMessage());
        }
    }
    
    // For CORS Preflight
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    private void sendError(HttpServletResponse response, int status, String msg) throws IOException {
        response.setStatus(status);
        PrintWriter out = response.getWriter();
        out.print("{\"error\":\"" + msg + "\"}");
        out.flush();
    }
}
