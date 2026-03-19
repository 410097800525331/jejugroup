package util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class JsonUtil {
    private JsonUtil() {
    }

    public static void writeJson(HttpServletResponse response, int status, String body) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        PrintWriter writer = response.getWriter();
        writer.print(body);
        writer.flush();
    }

    public static String readBody(HttpServletRequest request) throws IOException {
        StringBuilder body = new StringBuilder();

        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                body.append(line);
            }
        }

        return body.toString();
    }

    public static String extractRequestValue(HttpServletRequest request, String rawBody, String key) {
        String parameterValue = trimToNull(request.getParameter(key));
        if (parameterValue != null) {
            return parameterValue;
        }

        String jsonValue = extractJsonString(rawBody, key);
        return trimToNull(jsonValue);
    }

    public static String quote(String value) {
        return "\"" + escape(value) + "\"";
    }

    public static String escape(String value) {
        if (value == null) {
            return "";
        }

        String escaped = value.replace("\\", "\\\\");
        escaped = escaped.replace("\"", "\\\"");
        escaped = escaped.replace("\r", "\\r");
        escaped = escaped.replace("\n", "\\n");
        escaped = escaped.replace("\t", "\\t");
        return escaped;
    }

    private static String extractJsonString(String rawBody, String key) {
        if (rawBody == null || rawBody.isBlank()) {
            return null;
        }

        Pattern stringPattern = Pattern.compile("\"" + Pattern.quote(key) + "\"\\s*:\\s*\"((?:\\\\.|[^\"])*)\"");
        Matcher stringMatcher = stringPattern.matcher(rawBody);
        if (stringMatcher.find()) {
            return unescapeJsonString(stringMatcher.group(1));
        }

        Pattern literalPattern = Pattern.compile("\"" + Pattern.quote(key) + "\"\\s*:\\s*(true|false|null|-?\\d+(?:\\.\\d+)?)");
        Matcher literalMatcher = literalPattern.matcher(rawBody);
        if (literalMatcher.find()) {
            return literalMatcher.group(1);
        }

        return null;
    }

    private static String unescapeJsonString(String value) {
        StringBuilder builder = new StringBuilder();
        boolean escaped = false;

        for (int index = 0; index < value.length(); index++) {
            char current = value.charAt(index);

            if (!escaped) {
                if (current == '\\') {
                    escaped = true;
                } else {
                    builder.append(current);
                }
                continue;
            }

            switch (current) {
                case '"':
                    builder.append('"');
                    break;
                case '\\':
                    builder.append('\\');
                    break;
                case '/':
                    builder.append('/');
                    break;
                case 'b':
                    builder.append('\b');
                    break;
                case 'f':
                    builder.append('\f');
                    break;
                case 'n':
                    builder.append('\n');
                    break;
                case 'r':
                    builder.append('\r');
                    break;
                case 't':
                    builder.append('\t');
                    break;
                case 'u':
                    if (index + 4 < value.length()) {
                        String hex = value.substring(index + 1, index + 5);
                        builder.append((char) Integer.parseInt(hex, 16));
                        index += 4;
                    }
                    break;
                default:
                    builder.append(current);
                    break;
            }

            escaped = false;
        }

        if (escaped) {
            builder.append('\\');
        }

        return builder.toString();
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
