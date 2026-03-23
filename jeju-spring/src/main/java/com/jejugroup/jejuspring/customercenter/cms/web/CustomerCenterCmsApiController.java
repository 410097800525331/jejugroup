package com.jejugroup.jejuspring.customercenter.cms.web;

import java.sql.SQLException;
import java.util.Map;
import java.util.NoSuchElementException;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.customercenter.cms.application.CustomerCenterCmsService;
import com.jejugroup.jejuspring.customercenter.cms.application.CustomerCenterCmsService.FaqUpsertRequest;
import com.jejugroup.jejuspring.customercenter.cms.application.CustomerCenterCmsService.NoticeUpsertRequest;

@RestController
@RequestMapping("/api/customer-center")
public class CustomerCenterCmsApiController {
    private final CustomerCenterCmsService customerCenterCmsService;

    public CustomerCenterCmsApiController(CustomerCenterCmsService customerCenterCmsService) {
        this.customerCenterCmsService = customerCenterCmsService;
    }

    @GetMapping(value = "/notices", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> listNotices(@RequestParam(value = "serviceType", required = false) String serviceType) {
        try {
            return ok(customerCenterCmsService.listNotices(serviceType));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        } catch (RuntimeException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        }
    }

    @GetMapping(value = "/notices/{noticeId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getNotice(
        @PathVariable("noticeId") String noticeId,
        @RequestParam(value = "serviceType", required = false) String serviceType
    ) {
        try {
            return ok(customerCenterCmsService.getNotice(parseId(noticeId, "noticeId"), serviceType));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        } catch (RuntimeException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        }
    }

    @PostMapping(value = "/notices", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createNotice(
        @RequestBody(required = false) NoticeUpsertRequest request,
        HttpSession session
    ) {
        ResponseEntity<?> denied = requireAdmin(session);
        if (denied != null) {
            return denied;
        }

        try {
            return ok(customerCenterCmsService.createNotice(request));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        } catch (RuntimeException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        }
    }

    @PutMapping(value = "/notices/{noticeId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateNotice(
        @PathVariable("noticeId") String noticeId,
        @RequestBody(required = false) NoticeUpsertRequest request,
        HttpSession session
    ) {
        ResponseEntity<?> denied = requireAdmin(session);
        if (denied != null) {
            return denied;
        }

        try {
            return ok(customerCenterCmsService.updateNotice(parseId(noticeId, "noticeId"), request));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        } catch (RuntimeException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        }
    }

    @DeleteMapping(value = "/notices/{noticeId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteNotice(
        @PathVariable("noticeId") String noticeId,
        HttpSession session
    ) {
        ResponseEntity<?> denied = requireAdmin(session);
        if (denied != null) {
            return denied;
        }

        try {
            return ok(customerCenterCmsService.deleteNotice(parseId(noticeId, "noticeId")));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        } catch (RuntimeException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        }
    }

    @GetMapping(value = "/faqs", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> listFaqs(@RequestParam(value = "serviceType", required = false) String serviceType) {
        try {
            return ok(customerCenterCmsService.listFaqs(serviceType));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        } catch (RuntimeException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        }
    }

    @GetMapping(value = "/faqs/{faqId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getFaq(
        @PathVariable("faqId") String faqId,
        @RequestParam(value = "serviceType", required = false) String serviceType
    ) {
        try {
            return ok(customerCenterCmsService.getFaq(parseId(faqId, "faqId"), serviceType));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        } catch (RuntimeException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        }
    }

    @PostMapping(value = "/faqs", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createFaq(
        @RequestBody(required = false) FaqUpsertRequest request,
        HttpSession session
    ) {
        ResponseEntity<?> denied = requireAdmin(session);
        if (denied != null) {
            return denied;
        }

        try {
            return ok(customerCenterCmsService.createFaq(request));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        } catch (RuntimeException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        }
    }

    @PutMapping(value = "/faqs/{faqId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateFaq(
        @PathVariable("faqId") String faqId,
        @RequestBody(required = false) FaqUpsertRequest request,
        HttpSession session
    ) {
        ResponseEntity<?> denied = requireAdmin(session);
        if (denied != null) {
            return denied;
        }

        try {
            return ok(customerCenterCmsService.updateFaq(parseId(faqId, "faqId"), request));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        } catch (RuntimeException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        }
    }

    @DeleteMapping(value = "/faqs/{faqId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteFaq(
        @PathVariable("faqId") String faqId,
        HttpSession session
    ) {
        ResponseEntity<?> denied = requireAdmin(session);
        if (denied != null) {
            return denied;
        }

        try {
            return ok(customerCenterCmsService.deleteFaq(parseId(faqId, "faqId")));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        } catch (RuntimeException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Customer-center CMS service unavailable");
        }
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleUnreadableJson(HttpMessageNotReadableException exception) {
        return json(HttpStatus.BAD_REQUEST, false, "Request JSON is invalid");
    }

    private ResponseEntity<?> requireAdmin(HttpSession session) {
        Object sessionUser = session.getAttribute("user");
        if (!(sessionUser instanceof SessionUser user)) {
            return json(HttpStatus.UNAUTHORIZED, false, "로그인이 필요합니다.");
        }

        if (!isAdmin(user)) {
            return json(HttpStatus.FORBIDDEN, false, "권한이 없습니다.");
        }

        return null;
    }

    private boolean isAdmin(SessionUser user) {
        return user.role() != null && user.role().equalsIgnoreCase("ADMIN");
    }

    private long parseId(String rawValue, String fieldName) {
        if (rawValue == null || rawValue.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " is required");
        }

        try {
            long parsed = Long.parseLong(rawValue.trim());
            if (parsed <= 0L) {
                throw new IllegalArgumentException(fieldName + " must be a positive number");
            }
            return parsed;
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException(fieldName + " must be a positive number");
        }
    }

    private ResponseEntity<Map<String, Object>> ok(Object data) {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", data
        ));
    }

    private ResponseEntity<Map<String, Object>> json(HttpStatus status, boolean success, String message) {
        return ResponseEntity.status(status).body(Map.of(
            "success", success,
            "message", message
        ));
    }
}
