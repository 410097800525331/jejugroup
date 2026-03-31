package com.jejugroup.jejuspring.chat;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatApiController {
    private static final String OPAQUE_ERROR_MESSAGE = "채팅 서비스를 사용할 수 없습니다.";

    private final ChatService chatService;

    public ChatApiController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> status() {
        if (!chatService.isConfigured()) {
            return error(HttpStatus.SERVICE_UNAVAILABLE);
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("status", "online");
        data.put("configured", true);
        return ok(data);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> chat(@RequestBody(required = false) String requestBody) {
        try {
            String responseBody = chatService.forward(requestBody);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(responseBody);
        } catch (ChatUnavailableException exception) {
            return error(HttpStatus.SERVICE_UNAVAILABLE);
        } catch (ChatRequestException exception) {
            return error(HttpStatus.BAD_REQUEST);
        } catch (ChatUpstreamException exception) {
            return error(HttpStatus.BAD_GATEWAY);
        }
    }

    private ResponseEntity<Map<String, Object>> ok(Object data) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("data", data);
        return ResponseEntity.ok(body);
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status) {
        return ResponseEntity.status(status).body(Map.of(
            "success", false,
            "message", OPAQUE_ERROR_MESSAGE
        ));
    }
}
