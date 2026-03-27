package com.jejugroup.jejuspring.customercenter.support;

import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.jejugroup.jejuspring.auth.model.SessionUser;

@Service
public class SupportService {
    private final SupportCategoryService categoryService;
    private final SupportTicketService ticketService;
    private final SupportCommentService commentService;
    private final SupportAttachmentService attachmentService;

    public SupportService(
        SupportCategoryService categoryService,
        SupportTicketService ticketService,
        SupportCommentService commentService,
        SupportAttachmentService attachmentService
    ) {
        this.categoryService = categoryService;
        this.ticketService = ticketService;
        this.commentService = commentService;
        this.attachmentService = attachmentService;
    }

    public List<SupportCategoryView> listCategories(String serviceType) throws SQLException {
        return categoryService.listCategories(serviceType);
    }

    public List<SupportTicketView> listTickets(SessionUser user, String serviceType) throws SQLException {
        return ticketService.listTickets(user, serviceType);
    }

    public SupportTicketView createTicket(SessionUser user, SupportTicketUpsertRequest request) throws SQLException {
        return ticketService.createTicket(user, request);
    }

    public SupportTicketView getTicket(SessionUser user, long ticketId) throws SQLException {
        return ticketService.getTicket(user, ticketId);
    }

    public SupportTicketView updateTicket(SessionUser user, long ticketId, SupportTicketUpsertRequest request) throws SQLException {
        return ticketService.updateTicket(user, ticketId, request);
    }

    public void deleteTicket(SessionUser user, long ticketId) throws SQLException {
        ticketService.deleteTicket(user, ticketId);
    }

    public List<SupportCommentView> listComments(SessionUser user, long ticketId) throws SQLException {
        return commentService.listComments(user, ticketId);
    }

    public SupportCommentView createComment(SessionUser user, long ticketId, SupportCommentUpsertRequest request) throws SQLException {
        return commentService.createComment(user, ticketId, request);
    }

    public SupportCommentView updateComment(SessionUser user, long ticketId, long commentId, SupportCommentUpsertRequest request) throws SQLException {
        return commentService.updateComment(user, ticketId, commentId, request);
    }

    public void deleteComment(SessionUser user, long ticketId, long commentId) throws SQLException {
        commentService.deleteComment(user, ticketId, commentId);
    }

    public List<SupportAttachmentView> listAttachments(SessionUser user, long ticketId) throws SQLException {
        return attachmentService.listAttachments(user, ticketId);
    }

    public SupportAttachmentView createAttachment(SessionUser user, long ticketId, SupportAttachmentUpsertRequest request) throws SQLException {
        return attachmentService.createAttachment(user, ticketId, request);
    }

    public SupportAttachmentView updateAttachment(SessionUser user, long ticketId, long attachmentId, SupportAttachmentUpsertRequest request) throws SQLException {
        return attachmentService.updateAttachment(user, ticketId, attachmentId, request);
    }

    public void deleteAttachment(SessionUser user, long ticketId, long attachmentId) throws SQLException {
        attachmentService.deleteAttachment(user, ticketId, attachmentId);
    }
}
