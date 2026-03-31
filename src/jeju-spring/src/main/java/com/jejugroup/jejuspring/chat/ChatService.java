package com.jejugroup.jejuspring.chat;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ChatService {
    private static final String MODEL_ROLE = "model";
    private static final String USER_ROLE = "user";
    private static final String LOCAL_MODEL_VERSION = "local-knowledge";
    private static final int RECENT_USER_WINDOW = 3;
    private static final List<String> KNOWLEDGE_SOURCES = List.of(
        "front/jejuair/pages/jmembers/jmembersAirplane.html",
        "front/jejuair/pages/jmembers/jmembersGolf.html",
        "front/jejuair/pages/jmembers/jmembersInsurance.html",
        "front/jejuair/pages/jmembers/jmembersSightseeing.html",
        "front/apps/cs/client/src/data/serviceCenterData.ts"
    );
    private static final List<String> MEMBERSHIP_OVERVIEW_HINTS = List.of(
        "공항편의",
        "골프",
        "투어",
        "보험",
        "여행보험",
        "관광",
        "라운지",
        "면세점",
        "와이파이도시락",
        "도시락usim",
        "도시락esim",
        "하나은행",
        "신한ez",
        "agl",
        "클룩",
        "트리플",
        "nol",
        "중국가자",
        "피크타임",
        "vpass",
        "브이패스",
        "투어패스",
        "옹핑",
        "스타드림크루즈",
        "아르떼뮤지엄",
        "아르떼키즈파크",
        "카멜리아힐",
        "이월드",
        "이미지호"
    );

    private static final Pattern HTML_BLOCK = Pattern.compile("(?is)<(script|style|head)[^>]*>.*?</\\1>");
    private static final Pattern HTML_COMMENT = Pattern.compile("(?s)<!--.*?-->");
    private static final Pattern HTML_TEXT_BLOCK = Pattern.compile("(?is)<(h1|h2|h3|h4|h5|h6|p|span|li|div|a|strong|em|label|td|th)[^>]*>(.*?)</\\1>");
    private static final Pattern HTML_TAG = Pattern.compile("(?s)<[^>]+>");
    private static final Pattern QUOTED_LITERAL = Pattern.compile("\"((?:\\\\.|[^\"])*)\"|'((?:\\\\.|[^'])*)'|`((?:\\\\.|[^`])*)`");

    private final ObjectMapper objectMapper;
    private final LocalKnowledgeBase knowledgeBase;

    public ChatService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.knowledgeBase = LocalKnowledgeBase.load(KNOWLEDGE_SOURCES);
    }

    public boolean isConfigured() {
        return true;
    }

    public String forward(String requestBody) {
        JsonNode root = parseRequest(requestBody);
        List<String> userMessages = parseUserMessages(root);
        if (userMessages.isEmpty()) {
            throw new ChatRequestException();
        }

        String query = buildRetrievalQuery(userMessages);
        String answer = knowledgeBase.answer(query);

        try {
            return objectMapper.writeValueAsString(buildLocalResponse(answer));
        } catch (Exception exception) {
            throw new ChatUpstreamException();
        }
    }

    String buildRetrievalQuery(List<String> userMessages) {
        if (userMessages == null || userMessages.isEmpty()) {
            return "";
        }

        int fromIndex = Math.max(0, userMessages.size() - RECENT_USER_WINDOW);
        List<String> recentWindow = userMessages.subList(fromIndex, userMessages.size());
        return String.join("\n", recentWindow);
    }

    private JsonNode parseRequest(String requestBody) {
        if (!StringUtils.hasText(requestBody)) {
            throw new ChatRequestException();
        }

        try {
            return objectMapper.readTree(requestBody);
        } catch (Exception exception) {
            throw new ChatRequestException();
        }
    }

    private List<String> parseUserMessages(JsonNode root) {
        JsonNode messagesNode = root.path("messages");
        if (!messagesNode.isArray()) {
            throw new ChatRequestException();
        }

        List<String> userMessages = new ArrayList<>();
        for (JsonNode messageNode : messagesNode) {
            String role = text(messageNode, "role");
            String content = text(messageNode, "content");
            if (!StringUtils.hasText(role) || !StringUtils.hasText(content)) {
                throw new ChatRequestException();
            }

            if (USER_ROLE.equalsIgnoreCase(role.trim())) {
                userMessages.add(content.trim());
            }
        }

        return userMessages;
    }

    private String text(JsonNode node, String fieldName) {
        JsonNode field = node.get(fieldName);
        return field == null || field.isNull() ? "" : field.asText("");
    }

    private java.util.Map<String, Object> buildLocalResponse(String answer) {
        java.util.Map<String, Object> response = new java.util.LinkedHashMap<>();
        List<java.util.Map<String, Object>> candidates = new ArrayList<>();

        java.util.Map<String, Object> candidate = new java.util.LinkedHashMap<>();
        java.util.Map<String, Object> content = new java.util.LinkedHashMap<>();
        List<java.util.Map<String, Object>> parts = new ArrayList<>();
        parts.add(java.util.Map.of("text", sanitize(answer)));

        content.put("parts", parts);
        content.put("role", MODEL_ROLE);
        candidate.put("content", content);
        candidate.put("finishReason", "STOP");
        candidate.put("index", 0);
        candidates.add(candidate);

        response.put("candidates", candidates);
        response.put("modelVersion", LOCAL_MODEL_VERSION);
        return response;
    }

    private String sanitize(String text) {
        if (!StringUtils.hasText(text)) {
            return "";
        }

        return text.replace("**", "");
    }

    private static final class LocalKnowledgeBase {
        private static final String FALLBACK_TEXT = String.join("\n",
            "제주그룹 사이트 정보는 로컬 지식 기준으로만 안내하고 있습니다.",
            "멤버십, 예약, 수하물, 체크인, 환불 중 하나로 조금 더 구체적으로 물어봐 주시면 바로 답변드릴게요."
        );

        private final List<KnowledgeDocument> documents;
        private final Set<String> vocabulary;

        private LocalKnowledgeBase(List<KnowledgeDocument> documents, Set<String> vocabulary) {
            this.documents = documents;
            this.vocabulary = vocabulary;
        }

        static LocalKnowledgeBase load(List<String> sources) {
            List<KnowledgeDocument> documents = new ArrayList<>();
            Set<String> vocabulary = new HashSet<>();
            for (String source : sources) {
                Path resolved = resolveCandidate(source);
                if (resolved == null) {
                    continue;
                }

                String content = readKnowledgeContent(resolved);
                if (StringUtils.hasText(content)) {
                    KnowledgeDocument document = new KnowledgeDocument(source, content);
                    documents.add(document);
                    vocabulary.addAll(extractVocabulary(content));
                }
            }

            return new LocalKnowledgeBase(List.copyOf(documents), Set.copyOf(vocabulary));
        }

        String answer(String query) {
            if (!StringUtils.hasText(query) || documents.isEmpty()) {
                return FALLBACK_TEXT;
            }

            if (isMembershipOverviewQuery(query)) {
                return composeMembershipOverview();
            }

            if (isSupportFaqQuery(query)) {
                KnowledgeDocument supportDocument = findDocument("serviceCenterData.ts");
                if (supportDocument != null) {
                    List<String> queryTerms = extractQueryTerms(query, vocabulary);
                    Set<String> queryGrams = extractQueryGrams(query);
                    return String.join("\n", supportDocument.composeAnswerLines(queryTerms, queryGrams, query));
                }
            }

            List<String> queryTerms = extractQueryTerms(query, vocabulary);
            Set<String> queryGrams = extractQueryGrams(query);
            if (queryTerms.isEmpty() && queryGrams.isEmpty()) {
                return FALLBACK_TEXT;
            }

            List<KnowledgeScore> scores = documents.stream()
                .map(document -> document.score(query, queryTerms, queryGrams))
                .filter(result -> result.score() > 0)
                .sorted(Comparator
                    .comparingInt(KnowledgeScore::score).reversed()
                    .thenComparing(result -> result.document().source()))
                .limit(3)
                .toList();

            if (scores.isEmpty()) {
                return FALLBACK_TEXT;
            }

            List<String> answerLines = new ArrayList<>();
            for (KnowledgeScore score : scores) {
                answerLines.addAll(score.document().composeAnswerLines(queryTerms, queryGrams, query));
            }

            List<String> deduped = new ArrayList<>();
            for (String line : answerLines) {
                if (!deduped.contains(line)) {
                    deduped.add(line);
                }
                if (deduped.size() >= 5) {
                    break;
                }
            }

            if (deduped.isEmpty()) {
                return FALLBACK_TEXT;
            }

            return String.join("\n", deduped);
        }

        private String composeMembershipOverview() {
            List<String> lines = new ArrayList<>();
            for (KnowledgeDocument document : documents) {
                if (!document.source().contains("jmembers")) {
                    continue;
                }
                lines.addAll(document.leadingLines(3));
            }

            List<String> deduped = new ArrayList<>();
            for (String line : lines) {
                if (!deduped.contains(line)) {
                    deduped.add(line);
                }
                if (deduped.size() >= 10) {
                    break;
                }
            }

            return deduped.isEmpty() ? FALLBACK_TEXT : String.join("\n", deduped);
        }

        private KnowledgeDocument findDocument(String sourceSuffix) {
            for (KnowledgeDocument document : documents) {
                if (document.source().contains(sourceSuffix)) {
                    return document;
                }
            }
            return null;
        }

        private static Path resolveCandidate(String relativePath) {
            Path current = Path.of(System.getProperty("user.dir", ".")).toAbsolutePath().normalize();
            while (current != null) {
                Path candidate = current.resolve(relativePath).normalize();
                if (Files.isRegularFile(candidate)) {
                    return candidate;
                }
                current = current.getParent();
            }

            return null;
        }

        private static String readKnowledgeContent(Path path) {
            try {
                String raw = Files.readString(path, StandardCharsets.UTF_8);
                String suffix = path.getFileName().toString().toLowerCase(Locale.ROOT);
                if (suffix.endsWith(".html") || suffix.endsWith(".htm")) {
                    return extractHtmlText(raw);
                }
                if (suffix.endsWith(".ts") || suffix.endsWith(".tsx") || suffix.endsWith(".js") || suffix.endsWith(".jsx")) {
                    return extractQuotedText(raw);
                }
                return normalizeWhitespace(raw);
            } catch (IOException exception) {
                return "";
            }
        }

        private static String extractHtmlText(String raw) {
            String withoutBlocks = HTML_BLOCK.matcher(raw).replaceAll(" ");
            String withoutComments = HTML_COMMENT.matcher(withoutBlocks).replaceAll(" ");
            List<String> values = new ArrayList<>();
            Matcher matcher = HTML_TEXT_BLOCK.matcher(withoutComments);
            while (matcher.find()) {
                String inner = matcher.group(2);
                String stripped = HTML_TAG.matcher(inner).replaceAll(" ");
                String normalized = normalizeWhitespace(decodeHtmlEntities(stripped));
                if (StringUtils.hasText(normalized)) {
                    values.add(normalized);
                }
            }

            if (values.isEmpty()) {
                String stripped = HTML_TAG.matcher(withoutComments).replaceAll(" ");
                return normalizeWhitespace(decodeHtmlEntities(stripped));
            }

            return normalizeWhitespace(String.join("\n", values));
        }

        private static String extractQuotedText(String raw) {
            Matcher matcher = QUOTED_LITERAL.matcher(raw);
            List<String> values = new ArrayList<>();
            while (matcher.find()) {
                String value = firstGroup(matcher);
                if (StringUtils.hasText(value)) {
                    values.add(unescapeJavaString(value));
                }
            }

            if (values.isEmpty()) {
                return normalizeWhitespace(raw);
            }

            return normalizeWhitespace(String.join("\n", values));
        }

        private static String firstGroup(Matcher matcher) {
            for (int index = 1; index <= matcher.groupCount(); index++) {
                String value = matcher.group(index);
                if (value != null) {
                    return value;
                }
            }
            return "";
        }

        private static String unescapeJavaString(String value) {
            return value
                .replace("\\r", "\r")
                .replace("\\n", "\n")
                .replace("\\t", "\t")
                .replace("\\\"", "\"")
                .replace("\\'", "'")
                .replace("\\`", "`")
                .replace("\\\\", "\\");
        }

        private static String decodeHtmlEntities(String value) {
            return value
                .replace("&nbsp;", " ")
                .replace("&amp;", "&")
                .replace("&lt;", "<")
                .replace("&gt;", ">");
        }

        private static String normalizeWhitespace(String value) {
            return Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFKC)
                .replace('\u00A0', ' ')
                .replaceAll("[ \\t\\x0B\\f\\r]+", " ")
                .replaceAll("\\n{3,}", "\n\n")
                .replaceAll("(?m)^\\s+|\\s+$", "")
                .trim();
        }

        private static boolean isMembershipOverviewQuery(String query) {
            String normalized = normalizeQuery(query);
            boolean membershipIntent = normalized.contains("멤버십")
                || normalized.contains("멤버쉽")
                || normalized.contains("혜택")
                || normalized.contains("제휴");
            if (!membershipIntent) {
                return false;
            }

            for (String hint : MEMBERSHIP_OVERVIEW_HINTS) {
                if (normalized.contains(hint)) {
                    return false;
                }
            }

            return normalized.contains("뭐")
                || normalized.contains("어떤")
                || normalized.contains("무엇")
                || normalized.contains("있어")
                || normalized.contains("종류")
                || normalized.contains("전체");
        }

        private static boolean isSupportFaqQuery(String query) {
            String normalized = normalizeQuery(query);
            return containsAny(normalized, List.of("수하물", "체크인", "탑승", "마일리지", "좌석", "반려동물", "환불", "예약", "웹체크인", "탑승수속"));
        }

        private static List<String> extractQueryTerms(String query, Set<String> vocabulary) {
            String normalized = normalizeQuery(query);
            String[] rawTokens = normalized.split("[^\\p{IsAlphabetic}\\p{IsDigit}\\uAC00-\\uD7AF]+");
            Set<String> terms = new HashSet<>();

            for (String rawToken : rawTokens) {
                String token = normalizeQueryToken(rawToken);
                if (StringUtils.hasText(token) && token.length() >= 2) {
                    terms.add(token);
                }
            }

            for (String term : vocabulary) {
                if (normalized.contains(term)) {
                    terms.add(term);
                }
            }

            if (terms.isEmpty() && StringUtils.hasText(normalized)) {
                terms.add(normalized);
            }

            return List.copyOf(terms);
        }

        private static Set<String> extractQueryGrams(String query) {
            String normalized = normalizeQuery(query);
            Set<String> grams = new HashSet<>();
            if (normalized.length() < 3) {
                if (normalized.length() >= 2) {
                    grams.add(normalized);
                }
                return grams;
            }

            for (int index = 0; index <= normalized.length() - 3; index++) {
                grams.add(normalized.substring(index, index + 3));
            }
            return grams;
        }

        private static Set<String> extractVocabulary(String content) {
            Set<String> vocabulary = new HashSet<>();
            for (String line : content.split("\\R+")) {
                for (String token : line.split("[^\\p{IsAlphabetic}\\p{IsDigit}\\uAC00-\\uD7AF]+")) {
                    String normalized = normalizeQueryToken(token);
                    if (StringUtils.hasText(normalized) && normalized.length() >= 2) {
                        vocabulary.add(normalized);
                    }
                }
            }
            return vocabulary;
        }

        private static String normalizeQuery(String value) {
            if (!StringUtils.hasText(value)) {
                return "";
            }

            return Normalizer.normalize(value, Normalizer.Form.NFKC)
                .toLowerCase(Locale.KOREAN)
                .replace(" ", "")
                .replace("\n", "")
                .replace("\r", "")
                .replace("\t", "");
        }

        private static String normalizeQueryToken(String token) {
            String value = token;
            value = stripSuffix(value, "입니다");
            value = stripSuffix(value, "인가요");
            value = stripSuffix(value, "되나요");
            value = stripSuffix(value, "해줘");
            value = stripSuffix(value, "해줘요");
            value = stripSuffix(value, "있어요");
            value = stripSuffix(value, "있어");
            value = stripSuffix(value, "뭐가");
            value = stripSuffix(value, "뭐야");
            value = stripSuffix(value, "은");
            value = stripSuffix(value, "는");
            value = stripSuffix(value, "이");
            value = stripSuffix(value, "가");
            value = stripSuffix(value, "을");
            value = stripSuffix(value, "를");
            value = stripSuffix(value, "에");
            value = stripSuffix(value, "의");
            value = stripSuffix(value, "도");
            value = stripSuffix(value, "만");
            value = stripSuffix(value, "요");
            value = stripSuffix(value, "까");
            value = stripSuffix(value, "에게");
            value = stripSuffix(value, "에서");
            value = stripSuffix(value, "으로");
            value = stripSuffix(value, "로");
            value = stripSuffix(value, "에는");
            value = stripSuffix(value, "에는");
            return value;
        }

        private static String stripSuffix(String value, String suffix) {
            if (StringUtils.hasText(value) && value.endsWith(suffix) && value.length() > suffix.length()) {
                return value.substring(0, value.length() - suffix.length());
            }
            return value;
        }

        private static boolean containsAny(String normalized, List<String> keywords) {
            for (String keyword : keywords) {
                if (normalized.contains(normalizeQuery(keyword))) {
                    return true;
                }
            }
            return false;
        }
    }

    private record KnowledgeDocument(String source, String content) {
        private KnowledgeScore score(String query, List<String> queryTerms, Set<String> queryGrams) {
            String normalizedContent = LocalKnowledgeBase.normalizeQuery(content);
            int totalScore = 0;

            for (String term : queryTerms) {
                if (normalizedContent.contains(term)) {
                    totalScore += 10 + term.length();
                }
            }

            for (String gram : queryGrams) {
                if (normalizedContent.contains(gram)) {
                    totalScore += 1;
                }
            }

            String normalizedQuery = LocalKnowledgeBase.normalizeQuery(query);
            if (normalizedContent.contains(normalizedQuery)) {
                totalScore += 25;
            }

            totalScore += sourceBoost(query, source);

            return new KnowledgeScore(this, totalScore, queryTerms, queryGrams);
        }

        private int sourceBoost(String query, String source) {
            String normalized = LocalKnowledgeBase.normalizeQuery(query);
            if (source.contains("serviceCenterData.ts")) {
                return containsAny(normalized, List.of("수하물", "체크인", "탑승", "환불", "예약", "좌석", "마일리지", "반려동물", "휠체어", "유아")) ? 50 : 0;
            }
            if (source.contains("jmembersAirplane")) {
                return containsAny(normalized, List.of("공항", "라운지", "면세점", "와이파이", "유심", "esim", "공항편의")) ? 50 : 0;
            }
            if (source.contains("jmembersGolf")) {
                return containsAny(normalized, List.of("골프", "투어", "액티비티", "숙소", "중국", "베트남", "관광", "멤버십")) ? 50 : 0;
            }
            if (source.contains("jmembersInsurance")) {
                return containsAny(normalized, List.of("보험", "여행보험", "환전", "은행", "금융")) ? 50 : 0;
            }
            if (source.contains("jmembersSightseeing")) {
                return containsAny(normalized, List.of("관광", "옹핑", "크루즈", "아르떼", "카멜리아", "이월드", "이미지호")) ? 50 : 0;
            }
            return 0;
        }

        private boolean containsAny(String normalized, List<String> keywords) {
            for (String keyword : keywords) {
                if (normalized.contains(LocalKnowledgeBase.normalizeQuery(keyword))) {
                    return true;
                }
            }
            return false;
        }

        private List<String> composeAnswerLines(List<String> queryTerms, Set<String> queryGrams, String query) {
            List<String> lines = splitLines(content);
            if (source.contains("serviceCenterData.ts")) {
                List<String> supportLines = selectSupportLines(lines, query);
                if (!supportLines.isEmpty()) {
                    return supportLines;
                }
            }

            List<String> relevant = new ArrayList<>();

            for (int index = 0; index < lines.size(); index++) {
                String line = lines.get(index);
                if (line.isBlank()) {
                    continue;
                }

                if (matches(line, queryTerms, queryGrams)) {
                    relevant.add(line.trim());
                    if (index + 1 < lines.size()) {
                        String nextLine = lines.get(index + 1).trim();
                        if (StringUtils.hasText(nextLine)) {
                            relevant.add(nextLine);
                        }
                    }
                }
            }

            if (relevant.isEmpty()) {
                for (String line : lines) {
                    if (line.isBlank()) {
                        continue;
                    }
                    relevant.add(line.trim());
                    if (relevant.size() >= 3) {
                        break;
                    }
                }
            }

            if (relevant.isEmpty()) {
                return query.contains("멤버십")
                    ? "제주그룹 멤버십은 공항 편의, 골프/투어, 금융/여행자보험, 관광 제휴로 구성돼 있습니다."
                    .lines().toList()
                    : LocalKnowledgeBase.FALLBACK_TEXT.lines().toList();
            }

            List<String> deduped = new ArrayList<>();
            for (String line : relevant) {
                if (!deduped.contains(line)) {
                    deduped.add(line);
                }
                if (deduped.size() >= 4) {
                    break;
                }
            }

            return deduped;
        }

        private List<String> selectSupportLines(List<String> lines, String query) {
            List<String> supportHints = supportHintsFromQuery(query);
            if (supportHints.isEmpty()) {
                return List.of();
            }

            List<Integer> questionMatches = new ArrayList<>();
            List<Integer> fallbackMatches = new ArrayList<>();
            for (int index = 0; index < lines.size(); index++) {
                String line = lines.get(index);
                if (!matches(line, supportHints)) {
                    continue;
                }

                fallbackMatches.add(index);
                if (isQuestionLine(line)) {
                    questionMatches.add(index);
                }
            }

            List<Integer> candidateMatches = questionMatches.isEmpty() ? fallbackMatches : questionMatches;
            List<String> matched = new ArrayList<>();
            for (Integer index : candidateMatches) {
                String line = lines.get(index).trim();
                matched.add(line);
                if (index + 1 < lines.size()) {
                    String nextLine = lines.get(index + 1).trim();
                    if (StringUtils.hasText(nextLine)) {
                        matched.add(nextLine);
                    }
                }
            }

            List<String> deduped = new ArrayList<>();
            for (String line : matched) {
                if (!deduped.contains(line)) {
                    deduped.add(line);
                }
                if (deduped.size() >= 4) {
                    break;
                }
            }
            return deduped;
        }

        private boolean isQuestionLine(String line) {
            return StringUtils.hasText(line) && line.contains("?");
        }

        private boolean matches(String line, List<String> keywords) {
            String normalizedLine = LocalKnowledgeBase.normalizeQuery(line);
            for (String keyword : keywords) {
                if (normalizedLine.contains(LocalKnowledgeBase.normalizeQuery(keyword))) {
                    return true;
                }
            }
            return false;
        }

        private List<String> supportHintsFromQuery(String query) {
            String normalized = LocalKnowledgeBase.normalizeQuery(query);
            List<String> hints = new ArrayList<>();
            for (String keyword : List.of("수하물", "체크인", "탑승", "환불", "예약", "좌석", "마일리지", "반려동물", "휠체어", "유아", "웹체크인", "탑승수속")) {
                if (normalized.contains(LocalKnowledgeBase.normalizeQuery(keyword))) {
                    hints.add(keyword);
                }
            }
            return hints;
        }

        private boolean matches(String line, List<String> queryTerms, Set<String> queryGrams) {
            String normalizedLine = LocalKnowledgeBase.normalizeQuery(line);
            for (String term : queryTerms) {
                if (normalizedLine.contains(term)) {
                    return true;
                }
            }

            if (queryGrams.isEmpty()) {
                return false;
            }

            int overlap = 0;
            for (String gram : queryGrams) {
                if (normalizedLine.contains(gram)) {
                    overlap++;
                    if (overlap >= 2) {
                        return true;
                    }
                }
            }

            return overlap >= 1 && normalizedLine.length() <= 80;
        }

        private List<String> splitLines(String text) {
            String[] raw = text.split("\\R+");
            List<String> lines = new ArrayList<>();
            for (String line : raw) {
                String trimmed = line.trim();
                if (StringUtils.hasText(trimmed)) {
                    lines.add(trimmed);
                }
            }
            return lines;
        }

        private List<String> leadingLines(int maxLines) {
            List<String> lines = splitLines(content);
            List<String> leading = new ArrayList<>();
            for (String line : lines) {
                if (!StringUtils.hasText(line)) {
                    continue;
                }
                leading.add(line.trim());
                if (leading.size() >= maxLines) {
                    break;
                }
            }
            return leading;
        }
    }

    private record KnowledgeScore(KnowledgeDocument document, int score, List<String> queryTerms, Set<String> queryGrams) {
        private KnowledgeScore {
            queryTerms = List.copyOf(queryTerms);
            queryGrams = Set.copyOf(queryGrams);
        }
    }
}

class ChatUnavailableException extends RuntimeException {
}

class ChatRequestException extends RuntimeException {
}

class ChatUpstreamException extends RuntimeException {
}
