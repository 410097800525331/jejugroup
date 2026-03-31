package com.jejugroup.jejuspring.booking.web;

import java.sql.SQLException;
import java.util.Map;
import java.util.NoSuchElementException;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.booking.application.BookingReadService;
import com.jejugroup.jejuspring.booking.application.BookingWriteService;
import com.jejugroup.jejuspring.booking.model.BookingCheckoutRequest;
import com.jejugroup.jejuspring.booking.model.BookingGuestLookupRequest;

@RestController
@RequestMapping("/api/booking")
public class BookingApiController {
    private final BookingReadService bookingReadService;
    private final BookingWriteService bookingWriteService;

    public BookingApiController(BookingReadService bookingReadService, BookingWriteService bookingWriteService) {
        this.bookingReadService = bookingReadService;
        this.bookingWriteService = bookingWriteService;
    }

    @GetMapping(value = "/me", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> me(HttpSession session) {
        return readBookings(session, null);
    }

    @GetMapping(value = "/users/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> byUser(
        @PathVariable("userId") String userId,
        HttpSession session
    ) {
        return readBookings(session, userId);
    }

    private ResponseEntity<?> readBookings(HttpSession session, String requestedUserId) {
        Object sessionUser = session.getAttribute("user");
        if (!(sessionUser instanceof SessionUser user)) {
            return json(HttpStatus.UNAUTHORIZED, false, "로그인이 필요합니다.");
        }

        String scopeUserId = requestedUserId == null || requestedUserId.trim().isEmpty()
            ? user.id()
            : requestedUserId.trim();

        if (!scopeUserId.equals(user.id()) && !isAdmin(user)) {
            return json(HttpStatus.FORBIDDEN, false, "권한이 없습니다.");
        }

        try {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", bookingReadService.readUserBookings(scopeUserId)
            ));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Booking DB configuration is missing");
        }
    }

    @PostMapping(value = "/checkout", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> checkout(@RequestBody(required = false) BookingCheckoutRequest request, HttpSession session) {
        try {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", bookingWriteService.checkout(request, readSessionUser(session))
            ));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Booking DB configuration is missing");
        }
    }

    @PostMapping(value = "/guest-lookup", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> guestLookup(@RequestBody(required = false) BookingGuestLookupRequest request) {
        try {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", bookingWriteService.guestLookup(request)
            ));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Booking DB configuration is missing");
        }
    }

    @PostMapping(value = "/{bookingNo}/cancel", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> cancelBooking(@PathVariable("bookingNo") String bookingNo, HttpSession session) {
        SessionUser user = readSessionUser(session);
        if (user == null) {
            return json(HttpStatus.UNAUTHORIZED, false, "로그인이 필요합니다.");
        }

        try {
            BookingWriteService.BookingCancellationView cancellation = bookingWriteService.cancelBooking(bookingNo, user);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "예약이 취소되었습니다.",
                "data", cancellation
            ));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (BookingWriteService.BookingAccessDeniedException exception) {
            return json(HttpStatus.FORBIDDEN, false, exception.getMessage());
        } catch (BookingWriteService.BookingConflictException exception) {
            return json(HttpStatus.CONFLICT, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, "예약을 찾을 수 없습니다.");
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "예약 취소를 처리하지 못했습니다.");
        }
    }

    private SessionUser readSessionUser(HttpSession session) {
        Object sessionUser = session.getAttribute("user");
        if (sessionUser instanceof SessionUser user) {
            return user;
        }

        return null;
    }

    private boolean isAdmin(SessionUser user) {
        return user.role() != null && user.role().equalsIgnoreCase("ADMIN");
    }

    private ResponseEntity<Map<String, Object>> json(HttpStatus status, boolean success, String message) {
        return ResponseEntity.status(status).body(Map.of(
            "success", success,
            "message", message
        ));
    }
}
