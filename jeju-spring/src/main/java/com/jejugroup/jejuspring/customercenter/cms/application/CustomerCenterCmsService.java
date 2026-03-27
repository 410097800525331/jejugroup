package com.jejugroup.jejuspring.customercenter.cms.application;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class CustomerCenterCmsService {
    private final CustomerCenterCmsReadService readService;
    private final CustomerCenterCmsWriteService writeService;

    public CustomerCenterCmsService(CustomerCenterCmsReadService readService, CustomerCenterCmsWriteService writeService) {
        this.readService = readService;
        this.writeService = writeService;
    }

    public List<NoticeView> listNotices(String serviceType) throws SQLException {
        return readService.listNotices(serviceType);
    }

    public NoticeView getNotice(long noticeId, String serviceType) throws SQLException {
        return readService.getNotice(noticeId, serviceType);
    }

    public NoticeView createNotice(NoticeUpsertRequest request) throws SQLException {
        return writeService.createNotice(request);
    }

    public NoticeView updateNotice(long noticeId, NoticeUpsertRequest request) throws SQLException {
        return writeService.updateNotice(noticeId, request);
    }

    public DeletedRecord deleteNotice(long noticeId) throws SQLException {
        return writeService.deleteNotice(noticeId);
    }

    public List<FaqView> listFaqs(String serviceType) throws SQLException {
        return readService.listFaqs(serviceType);
    }

    public FaqView getFaq(long faqId, String serviceType) throws SQLException {
        return readService.getFaq(faqId, serviceType);
    }

    public FaqView createFaq(FaqUpsertRequest request) throws SQLException {
        return writeService.createFaq(request);
    }

    public FaqView updateFaq(long faqId, FaqUpsertRequest request) throws SQLException {
        return writeService.updateFaq(faqId, request);
    }

    public DeletedRecord deleteFaq(long faqId) throws SQLException {
        return writeService.deleteFaq(faqId);
    }

    public record NoticeUpsertRequest(
        String serviceType,
        String title,
        String excerpt,
        String content,
        Boolean active,
        Boolean pinned,
        String publishedAt
    ) {
    }

    public record FaqUpsertRequest(
        String serviceType,
        String category,
        String question,
        String answer,
        Integer sortOrder,
        Boolean active
    ) {
    }

    public record NoticeView(
        long id,
        String serviceType,
        String title,
        String excerpt,
        String content,
        boolean pinned,
        boolean active,
        LocalDateTime publishedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
    ) {
    }

    public record FaqView(
        long id,
        String serviceType,
        String category,
        String question,
        String answer,
        int sortOrder,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
    ) {
    }

    public record DeletedRecord(
        long id,
        String entity
    ) {
    }
}
