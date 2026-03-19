package controller;

import util.EnvLoader;

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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@WebServlet("/api/chat")
public class ChatbotController extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
    private static final Pattern MESSAGE_PATTERN = Pattern.compile(
        "\\{\\s*\"role\"\\s*:\\s*\"((?:\\\\.|[^\"\\\\])*)\"\\s*,\\s*\"content\"\\s*:\\s*\"((?:\\\\.|[^\"\\\\])*)\"\\s*\\}"
    );

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        // CORS Setup
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        String apiKey = firstNonBlank(
            EnvLoader.get("GEMINI_API_KEY"),
            EnvLoader.get("GOOGLE_API_KEY")
        );
        if (apiKey == null || apiKey.isEmpty()) {
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Gemini API key configuration missing");
            return;
        }

        String model = firstNonBlank(EnvLoader.get("GEMINI_MODEL"), DEFAULT_GEMINI_MODEL);
        String requestBody = readRequestBody(request);

        if (requestBody.isEmpty()) {
            sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Empty request body");
            return;
        }

        List<ChatMessage> messages = parseMessages(requestBody);
        if (messages.isEmpty()) {
            sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid chat payload");
            return;
        }

        String payloadJSONStr = buildGeminiPayload(messages);

        try {
            URL url = new URL(
                "https://generativelanguage.googleapis.com/v1beta/models/"
                    + model
                    + ":generateContent?key="
                    + URLEncoder.encode(apiKey, StandardCharsets.UTF_8)
            );
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(12000);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = payloadJSONStr.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int status = conn.getResponseCode();

            BufferedReader in = null;
            if (status >= 200 && status < 300 && conn.getInputStream() != null) {
                in = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
            } else if (conn.getErrorStream() != null) {
                in = new BufferedReader(new InputStreamReader(conn.getErrorStream(), StandardCharsets.UTF_8));
                response.setStatus(status);
            }

            StringBuilder content = new StringBuilder();
            if (in != null) {
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    content.append(inputLine);
                }
                in.close();
            }
            conn.disconnect();

            PrintWriter out = response.getWriter();
            out.print(content.toString());
            out.flush();

        } catch (Exception e) {
            e.printStackTrace();
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to connect to Gemini service: " + e.getMessage());
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
        out.print("{\"error\":\"" + jsonEscape(msg) + "\"}");
        out.flush();
    }

    private String readRequestBody(HttpServletRequest request) throws IOException {
        StringBuilder requestBody = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                requestBody.append(line);
            }
        }
        return requestBody.toString().trim();
    }

    private List<ChatMessage> parseMessages(String requestBody) {
        Matcher matcher = MESSAGE_PATTERN.matcher(requestBody);
        List<ChatMessage> messages = new ArrayList<>();

        while (matcher.find()) {
            String role = jsonUnescape(matcher.group(1)).trim();
            String content = jsonUnescape(matcher.group(2)).trim();
            if (!role.isEmpty() && !content.isEmpty()) {
                messages.add(new ChatMessage(role, content));
            }
        }

        return messages;
    }

    private String buildGeminiPayload(List<ChatMessage> messages) {
        StringBuilder systemInstruction = new StringBuilder();
        List<ChatMessage> conversation = new ArrayList<>();

        for (ChatMessage message : messages) {
            if ("system".equalsIgnoreCase(message.role())) {
                if (systemInstruction.length() > 0) {
                    systemInstruction.append("\n\n");
                }
                systemInstruction.append(message.content());
                continue;
            }

            String geminiRole = normalizeGeminiRole(message.role());
            conversation.add(new ChatMessage(geminiRole, message.content()));
        }

        StringBuilder payload = new StringBuilder();
        payload.append("{");

        boolean hasPreviousField = false;
        if (systemInstruction.length() > 0) {
            payload.append("\"systemInstruction\":{\"parts\":[{\"text\":\"")
                .append(jsonEscape(systemInstruction.toString()))
                .append("\"}]}");
            hasPreviousField = true;
        }

        if (hasPreviousField) {
            payload.append(",");
        }

        payload.append("\"contents\":[");
        for (int i = 0; i < conversation.size(); i++) {
            ChatMessage message = conversation.get(i);
            if (i > 0) {
                payload.append(",");
            }
            payload.append("{\"role\":\"")
                .append(jsonEscape(message.role()))
                .append("\",\"parts\":[{\"text\":\"")
                .append(jsonEscape(message.content()))
                .append("\"}]}");
        }
        payload.append("],");
        payload.append("\"generationConfig\":{\"temperature\":0.7,\"maxOutputTokens\":300}}");

        return payload.toString();
    }

    private String normalizeGeminiRole(String role) {
        if ("assistant".equalsIgnoreCase(role) || "model".equalsIgnoreCase(role) || "bot".equalsIgnoreCase(role)) {
            return "model";
        }
        return "user";
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.trim().isEmpty()) {
                return value.trim();
            }
        }
        return "";
    }

    private String jsonEscape(String value) {
        StringBuilder escaped = new StringBuilder();
        for (int i = 0; i < value.length(); i++) {
            char current = value.charAt(i);
            switch (current) {
                case '"':
                    escaped.append("\\\"");
                    break;
                case '\\':
                    escaped.append("\\\\");
                    break;
                case '\b':
                    escaped.append("\\b");
                    break;
                case '\f':
                    escaped.append("\\f");
                    break;
                case '\n':
                    escaped.append("\\n");
                    break;
                case '\r':
                    escaped.append("\\r");
                    break;
                case '\t':
                    escaped.append("\\t");
                    break;
                default:
                    if (current < 0x20) {
                        escaped.append(String.format("\\u%04x", (int) current));
                    } else {
                        escaped.append(current);
                    }
                    break;
            }
        }
        return escaped.toString();
    }

    private String jsonUnescape(String value) {
        StringBuilder unescaped = new StringBuilder();
        for (int i = 0; i < value.length(); i++) {
            char current = value.charAt(i);
            if (current != '\\' || i + 1 >= value.length()) {
                unescaped.append(current);
                continue;
            }

            char next = value.charAt(++i);
            switch (next) {
                case '"':
                case '\\':
                case '/':
                    unescaped.append(next);
                    break;
                case 'b':
                    unescaped.append('\b');
                    break;
                case 'f':
                    unescaped.append('\f');
                    break;
                case 'n':
                    unescaped.append('\n');
                    break;
                case 'r':
                    unescaped.append('\r');
                    break;
                case 't':
                    unescaped.append('\t');
                    break;
                case 'u':
                    if (i + 4 < value.length()) {
                        String hex = value.substring(i + 1, i + 5);
                        try {
                            unescaped.append((char) Integer.parseInt(hex, 16));
                            i += 4;
                        } catch (NumberFormatException ignored) {
                            unescaped.append("\\u").append(hex);
                            i += 4;
                        }
                    } else {
                        unescaped.append("\\u");
                    }
                    break;
                default:
                    unescaped.append(next);
                    break;
            }
        }
        return unescaped.toString();
    }

    private record ChatMessage(String role, String content) {
    }
}
