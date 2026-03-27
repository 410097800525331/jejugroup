package com.jejugroup.jejuspring.customercenter.support;

import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jejugroup.jejuspring.auth.model.SessionUser;

@RestController
@RequestMapping("/api/customer-center/support")
public class SupportApiController {
    private final SupportService supportService;

    public SupportApiController(SupportService supportService) {
        this.supportService = supportService;
    }

    @GetMapping(value = "/categories", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> categories(@RequestParam(name = "serviceType", required = false) String serviceType) {
        return run(() -> supportService.listCategories(serviceType));
    }

    @GetMapping(value = "/tickets", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> tickets(@RequestParam(name = "serviceType", required = false) String serviceType, HttpSession session) {
        return runWithUser(session, user -> supportService.listTickets(user, serviceType));
    }

    @PostMapping(value = "/tickets", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createTicket(@RequestBody SupportTicketUpsertRequest request, HttpSession session) {
        return runWithUser(session, user -> supportService.createTicket(user, request));
    }

    @GetMapping(value = "/tickets/{ticketId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> ticket(@PathVariable("ticketId") long ticketId, HttpSession session) {
        return runWithUser(session, user -> supportService.getTicket(user, ticketId));
    }

    @PutMapping(value = "/tickets/{ticketId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateTicket(@PathVariable("ticketId") long ticketId, @RequestBody SupportTicketUpsertRequest request, HttpSession session) {
        return runWithUser(session, user -> supportService.updateTicket(user, ticketId, request));
    }

    @DeleteMapping(value = "/tickets/{ticketId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteTicket(@PathVariable("ticketId") long ticketId, HttpSession session) {
        return runWithUser(session, user -> {
            supportService.deleteTicket(user, ticketId);
            return Map.of("deleted", true, "ticketId", ticketId);
        });
    }

    @GetMapping(value = "/tickets/{ticketId}/comments", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> comments(@PathVariable("ticketId") long ticketId, HttpSession session) {
        return runWithUser(session, user -> supportService.listComments(user, ticketId));
    }

    @PostMapping(value = "/tickets/{ticketId}/comments", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createComment(@PathVariable("ticketId") long ticketId, @RequestBody SupportCommentUpsertRequest request, HttpSession session) {
        return runWithUser(session, user -> supportService.createComment(user, ticketId, request));
    }

    @PutMapping(value = "/tickets/{ticketId}/comments/{commentId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateComment(
        @PathVariable("ticketId") long ticketId,
        @PathVariable("commentId") long commentId,
        @RequestBody SupportCommentUpsertRequest request,
        HttpSession session
    ) {
        return runWithUser(session, user -> supportService.updateComment(user, ticketId, commentId, request));
    }

    @DeleteMapping(value = "/tickets/{ticketId}/comments/{commentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteComment(@PathVariable("ticketId") long ticketId, @PathVariable("commentId") long commentId, HttpSession session) {
        return runWithUser(session, user -> {
            supportService.deleteComment(user, ticketId, commentId);
            return Map.of("deleted", true, "commentId", commentId);
        });
    }

    @GetMapping(value = "/tickets/{ticketId}/attachments", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> attachments(@PathVariable("ticketId") long ticketId, HttpSession session) {
        return runWithUser(session, user -> supportService.listAttachments(user, ticketId));
    }

    @PostMapping(value = "/tickets/{ticketId}/attachments", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createAttachment(@PathVariable("ticketId") long ticketId, @RequestBody SupportAttachmentUpsertRequest request, HttpSession session) {
        return runWithUser(session, user -> supportService.createAttachment(user, ticketId, request));
    }

    @PutMapping(value = "/tickets/{ticketId}/attachments/{attachmentId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateAttachment(
        @PathVariable("ticketId") long ticketId,
        @PathVariable("attachmentId") long attachmentId,
        @RequestBody SupportAttachmentUpsertRequest request,
        HttpSession session
    ) {
        return runWithUser(session, user -> supportService.updateAttachment(user, ticketId, attachmentId, request));
    }

    @DeleteMapping(value = "/tickets/{ticketId}/attachments/{attachmentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteAttachment(
        @PathVariable("ticketId") long ticketId,
        @PathVariable("attachmentId") long attachmentId,
        HttpSession session
    ) {
        return runWithUser(session, user -> {
            supportService.deleteAttachment(user, ticketId, attachmentId);
            return Map.of("deleted", true, "attachmentId", attachmentId);
        });
    }

    private ResponseEntity<?> run(ThrowingSupplier<Object> supplier) {
        try {
            return ok(supplier.get());
        } catch (IllegalArgumentException exception) {
            return error(HttpStatus.BAD_REQUEST, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return error(HttpStatus.NOT_FOUND, exception.getMessage());
        } catch (ForbiddenOperationException exception) {
            return error(HttpStatus.FORBIDDEN, exception.getMessage());
        } catch (SQLException exception) {
            return error(HttpStatus.SERVICE_UNAVAILABLE, "Spring customer-center support DB configuration is missing");
        }
    }

    private ResponseEntity<?> runWithUser(HttpSession session, UserFunction<Object> function) {
        Object sessionUser = session.getAttribute("user");
        if (!(sessionUser instanceof SessionUser user)) {
            return error(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return run(() -> function.apply(user));
    }

    private ResponseEntity<Map<String, Object>> ok(Object data) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("data", data);
        return ResponseEntity.ok(body);
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("success", false, "message", message));
    }

    @FunctionalInterface
    private interface ThrowingSupplier<T> {
        T get() throws SQLException;
    }

    @FunctionalInterface
    private interface UserFunction<T> {
        T apply(SessionUser user) throws SQLException;
    }
}

record SupportCategoryView(long id, String serviceType, String code, String name, String description, int sortOrder, boolean active) {
}

record SupportTicketView(
    long id,
    String userId,
    String serviceType,
    Long categoryId,
    String categoryCode,
    String categoryName,
    String categoryDescription,
    String inquiryTypeCode,
    String requesterName,
    String requesterEmail,
    String requesterPhone,
    String title,
    String content,
    String status,
    String priority
) {
}

record SupportCommentView(long id, long ticketId, String authorUserId, String authorRole, String authorName, String content, boolean internal) {
}

record SupportAttachmentView(
    long id,
    long ticketId,
    String uploadedByUserId,
    String originalFilename,
    String storedFilename,
    String storageKey,
    String contentType,
    long fileSizeBytes
) {
}

record SupportTicketUpsertRequest(
    String serviceType,
    Long categoryId,
    String inquiryTypeCode,
    String requesterName,
    String requesterEmail,
    String requesterPhone,
    String title,
    String content,
    String status,
    String priority
) {
}

record SupportCommentUpsertRequest(String content, Boolean isInternal) {
}

record SupportAttachmentUpsertRequest(
    String originalFilename,
    String storedFilename,
    String storageKey,
    String contentType,
    Long fileSizeBytes
) {
}

class ForbiddenOperationException extends RuntimeException {
    ForbiddenOperationException(String message) {
        super(message);
    }
}
