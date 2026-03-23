package com.jejugroup.jejuspring.customercenter;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.jayway.jsonpath.JsonPath;
import com.jejugroup.jejuspring.auth.model.SessionUser;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CustomerCenterIntegrationTests {
    private static final long SUPPORT_CATEGORY_ID = 910101L;
    private static final long SUPPORT_TICKET_ID = 910201L;
    private static final String SUPPORT_SERVICE_TYPE = "jeju-air";
    private static final String SUPPORT_OWNER_ID = "cc-support-owner";
    private static final String SUPPORT_OWNER_NAME = "Support Owner";
    private static final String SUPPORT_OWNER_EMAIL = "support.owner@example.com";
    private static final String SUPPORT_OWNER_PHONE = "010-1111-2222";
    private static final String SUPPORT_OTHER_ID = "cc-support-other";
    private static final String SUPPORT_ADMIN_ID = "cc-support-admin";

    private static final long NOTICE_ACTIVE_ID = 920001L;
    private static final long NOTICE_INACTIVE_ID = 920002L;
    private static final long FAQ_ACTIVE_ID = 930001L;
    private static final long FAQ_INACTIVE_ID = 930002L;

    private static final String NOTICE_SERVICE_TYPE = "jeju-air";
    private static final String FAQ_SERVICE_TYPE = "jeju-stay";

    private static final String NOTICE_ACTIVE_TITLE = "CC Notice Active";
    private static final String NOTICE_INACTIVE_TITLE = "CC Notice Inactive";
    private static final String NOTICE_CREATED_TITLE = "CC Notice Created By Admin";

    private static final String FAQ_ACTIVE_QUESTION = "CC FAQ Active?";
    private static final String FAQ_INACTIVE_QUESTION = "CC FAQ Inactive?";
    private static final String FAQ_CREATED_QUESTION = "CC FAQ Created By Admin?";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @AfterEach
    void cleanup() {
        jdbcTemplate.update("DELETE FROM support_attachments WHERE ticket_id = ?", SUPPORT_TICKET_ID);
        jdbcTemplate.update("DELETE FROM support_comments WHERE ticket_id = ?", SUPPORT_TICKET_ID);
        jdbcTemplate.update("DELETE FROM support_tickets WHERE id = ?", SUPPORT_TICKET_ID);
        jdbcTemplate.update("DELETE FROM support_categories WHERE id = ?", SUPPORT_CATEGORY_ID);
        jdbcTemplate.update("DELETE FROM notices WHERE id IN (?, ?) OR title = ?", NOTICE_ACTIVE_ID, NOTICE_INACTIVE_ID, NOTICE_CREATED_TITLE);
        jdbcTemplate.update("DELETE FROM faqs WHERE id IN (?, ?) OR question = ?", FAQ_ACTIVE_ID, FAQ_INACTIVE_ID, FAQ_CREATED_QUESTION);
        jdbcTemplate.update("DELETE FROM users WHERE id IN (?, ?, ?)", SUPPORT_OWNER_ID, SUPPORT_OTHER_ID, SUPPORT_ADMIN_ID);
    }

    @Test
    void unauthenticatedSupportTicketLookupReturns401() throws Exception {
        seedSupportFixture();

        mockMvc.perform(get("/api/customer-center/support/tickets/{ticketId}", SUPPORT_TICKET_ID))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void ownerCanReadAndUpdateOwnSupportTicket() throws Exception {
        seedSupportFixture();

        mockMvc.perform(get("/api/customer-center/support/tickets/{ticketId}", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER")))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.data.id").value(SUPPORT_TICKET_ID))
            .andExpect(jsonPath("$.data.title").value("Original support ticket"));

        mockMvc.perform(put("/api/customer-center/support/tickets/{ticketId}", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(supportTicketJson("Owner updated title", "Owner updated content", SUPPORT_SERVICE_TYPE)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.title").value("Owner updated title"))
            .andExpect(jsonPath("$.data.content").value("Owner updated content"));

        String updatedTitle = jdbcTemplate.queryForObject(
            "SELECT title FROM support_tickets WHERE id = ?",
            String.class,
            SUPPORT_TICKET_ID
        );
        assertThat(updatedTitle).isEqualTo("Owner updated title");
    }

    @Test
    void otherUserIsForbiddenButAdminCanOverrideSupportTicket() throws Exception {
        seedSupportFixture();

        mockMvc.perform(get("/api/customer-center/support/tickets/{ticketId}", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_OTHER_ID, "Support Other", "USER")))
            .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/customer-center/support/tickets/{ticketId}", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_ADMIN_ID, "Support Admin", "ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(supportTicketJson("Admin override title", "Admin override content", SUPPORT_SERVICE_TYPE)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.title").value("Admin override title"))
            .andExpect(jsonPath("$.data.content").value("Admin override content"));

        String updatedContent = jdbcTemplate.queryForObject(
            "SELECT content FROM support_tickets WHERE id = ?",
            String.class,
            SUPPORT_TICKET_ID
        );
        assertThat(updatedContent).isEqualTo("Admin override content");
    }

    @Test
    void createSupportTicketRejectsInvalidServiceType() throws Exception {
        seedSupportOwner();
        seedSupportCategory();

        mockMvc.perform(post("/api/customer-center/support/tickets")
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER"))
                .contentType(MediaType.APPLICATION_JSON)
            .content(supportTicketJson("Invalid Service", "Bad content", "not-a-service")))
            .andExpect(status().isBadRequest());
    }

    @Test
    void createAndUpdateSupportTicketRejectsInvalidStatusAndPriority() throws Exception {
        seedSupportFixture();

        mockMvc.perform(post("/api/customer-center/support/tickets")
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(supportTicketJson("Invalid Status", "Bad content", SUPPORT_SERVICE_TYPE, "bogus", "normal")))
            .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/customer-center/support/tickets")
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(supportTicketJson("Invalid Priority", "Bad content", SUPPORT_SERVICE_TYPE, "pending", "bogus")))
            .andExpect(status().isBadRequest());

        mockMvc.perform(put("/api/customer-center/support/tickets/{ticketId}", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(supportTicketJson("Invalid Update Status", "Update content", SUPPORT_SERVICE_TYPE, "bogus", "normal")))
            .andExpect(status().isBadRequest());

        mockMvc.perform(put("/api/customer-center/support/tickets/{ticketId}", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(supportTicketJson("Invalid Update Priority", "Update content", SUPPORT_SERVICE_TYPE, "pending", "bogus")))
            .andExpect(status().isBadRequest());
    }

    @Test
    void supportTicketUpdateAcceptsCurrentStatusAndPriorityWhitelist() throws Exception {
        seedSupportFixture();

        for (String allowedStatus : new String[] {"pending", "in_progress", "waiting", "open", "answered", "resolved", "closed"}) {
            mockMvc.perform(put("/api/customer-center/support/tickets/{ticketId}", SUPPORT_TICKET_ID)
                    .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(supportTicketJson(
                        "Status whitelist " + allowedStatus,
                        "Whitelist content",
                        SUPPORT_SERVICE_TYPE,
                        allowedStatus,
                        "normal"
                    )))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value(allowedStatus))
                .andExpect(jsonPath("$.data.priority").value("normal"));
        }

        for (String allowedPriority : new String[] {"low", "normal", "high", "urgent"}) {
            mockMvc.perform(put("/api/customer-center/support/tickets/{ticketId}", SUPPORT_TICKET_ID)
                    .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(supportTicketJson(
                        "Priority whitelist " + allowedPriority,
                        "Whitelist content",
                        SUPPORT_SERVICE_TYPE,
                        "pending",
                        allowedPriority
                    )))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("pending"))
                .andExpect(jsonPath("$.data.priority").value(allowedPriority));
        }
    }

    @Test
    void supportCommentsRespectParentTicketOwnershipChain() throws Exception {
        seedSupportFixture();

        MvcResult created = mockMvc.perform(post("/api/customer-center/support/tickets/{ticketId}/comments", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(commentJson("Owner comment", false)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.content").value("Owner comment"))
            .andReturn();

        long commentId = ((Number) JsonPath.read(created.getResponse().getContentAsString(), "$.data.id")).longValue();

        mockMvc.perform(get("/api/customer-center/support/tickets/{ticketId}/comments", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.length()").value(1))
            .andExpect(jsonPath("$.data[0].content").value("Owner comment"))
            .andExpect(jsonPath("$.data[0].internal").value(false));

        mockMvc.perform(put("/api/customer-center/support/tickets/{ticketId}/comments/{commentId}", SUPPORT_TICKET_ID, commentId)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(commentJson("Owner comment updated", true)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.content").value("Owner comment updated"))
            .andExpect(jsonPath("$.data.internal").value(true));

        mockMvc.perform(get("/api/customer-center/support/tickets/{ticketId}/comments", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.length()").value(1))
            .andExpect(jsonPath("$.data[0].content").value("Owner comment updated"))
            .andExpect(jsonPath("$.data[0].internal").value(true));

        mockMvc.perform(post("/api/customer-center/support/tickets/{ticketId}/comments", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_OTHER_ID, "Support Other", "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(commentJson("Forbidden comment", false)))
            .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/customer-center/support/tickets/{ticketId}/comments/{commentId}", SUPPORT_TICKET_ID, commentId)
                .sessionAttr("user", sessionUser(SUPPORT_ADMIN_ID, "Support Admin", "ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(commentJson("Admin comment update", false)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.content").value("Admin comment update"));

        mockMvc.perform(delete("/api/customer-center/support/tickets/{ticketId}/comments/{commentId}", SUPPORT_TICKET_ID, commentId)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER")))
            .andExpect(status().isOk());

        mockMvc.perform(get("/api/customer-center/support/tickets/{ticketId}/comments", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.length()").value(0));

        assertThat(jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM support_comments WHERE ticket_id = ?",
            Long.class,
            SUPPORT_TICKET_ID
        )).isEqualTo(0L);
    }

    @Test
    void supportAttachmentsRespectParentTicketOwnershipAndRejectMultipart() throws Exception {
        seedSupportFixture();

        MvcResult created = mockMvc.perform(post("/api/customer-center/support/tickets/{ticketId}/attachments", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(attachmentJson("invoice.pdf", "stored-invoice.pdf", "support/tickets/910201/invoice.pdf", "application/pdf", 128L)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.originalFilename").value("invoice.pdf"))
            .andReturn();

        long attachmentId = ((Number) JsonPath.read(created.getResponse().getContentAsString(), "$.data.id")).longValue();

        mockMvc.perform(get("/api/customer-center/support/tickets/{ticketId}/attachments", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.length()").value(1))
            .andExpect(jsonPath("$.data[0].originalFilename").value("invoice.pdf"))
            .andExpect(jsonPath("$.data[0].contentType").value("application/pdf"))
            .andExpect(jsonPath("$.data[0].fileSizeBytes").value(128));

        mockMvc.perform(put("/api/customer-center/support/tickets/{ticketId}/attachments/{attachmentId}", SUPPORT_TICKET_ID, attachmentId)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(attachmentJson("invoice-v2.pdf", "stored-invoice-v2.pdf", "support/tickets/910201/invoice-v2.pdf", "application/pdf", 256L)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.originalFilename").value("invoice-v2.pdf"))
            .andExpect(jsonPath("$.data.contentType").value("application/pdf"))
            .andExpect(jsonPath("$.data.fileSizeBytes").value(256));

        mockMvc.perform(get("/api/customer-center/support/tickets/{ticketId}/attachments", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.length()").value(1))
            .andExpect(jsonPath("$.data[0].originalFilename").value("invoice-v2.pdf"))
            .andExpect(jsonPath("$.data[0].storedFilename").value("stored-invoice-v2.pdf"))
            .andExpect(jsonPath("$.data[0].fileSizeBytes").value(256));

        mockMvc.perform(post("/api/customer-center/support/tickets/{ticketId}/attachments", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_OTHER_ID, "Support Other", "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(attachmentJson("forbidden.pdf", "forbidden.pdf", "support/tickets/910201/forbidden.pdf", "application/pdf", 64L)))
            .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/customer-center/support/tickets/{ticketId}/attachments/{attachmentId}", SUPPORT_TICKET_ID, attachmentId)
                .sessionAttr("user", sessionUser(SUPPORT_ADMIN_ID, "Support Admin", "ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(attachmentJson("admin.pdf", "admin.pdf", "support/tickets/910201/admin.pdf", "application/pdf", 512L)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.originalFilename").value("admin.pdf"));

        mockMvc.perform(delete("/api/customer-center/support/tickets/{ticketId}/attachments/{attachmentId}", SUPPORT_TICKET_ID, attachmentId)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER")))
            .andExpect(status().isOk());

        mockMvc.perform(get("/api/customer-center/support/tickets/{ticketId}/attachments", SUPPORT_TICKET_ID)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.length()").value(0));

        assertThat(jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM support_attachments WHERE ticket_id = ?",
            Long.class,
            SUPPORT_TICKET_ID
        )).isEqualTo(0L);
    }

    @Test
    void supportAttachmentMultipartRequestIsRejected() throws Exception {
        seedSupportFixture();

        MockMultipartFile file = new MockMultipartFile(
            "file",
            "invoice.pdf",
            MediaType.APPLICATION_PDF_VALUE,
            "binary".getBytes()
        );

        mockMvc.perform(multipart("/api/customer-center/support/tickets/{ticketId}/attachments", SUPPORT_TICKET_ID)
                .file(file)
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER")))
            .andExpect(status().is4xxClientError());
    }

    @Test
    void publicNoticeEndpointsFilterByServiceTypeAndHideInactiveRows() throws Exception {
        seedNoticeFixtures();

        mockMvc.perform(get("/api/customer-center/notices").param("serviceType", NOTICE_SERVICE_TYPE))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.data.length()").value(1))
            .andExpect(jsonPath("$.data[0].title").value(NOTICE_ACTIVE_TITLE));

        mockMvc.perform(get("/api/customer-center/notices/{noticeId}", NOTICE_ACTIVE_ID).param("serviceType", NOTICE_SERVICE_TYPE))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.title").value(NOTICE_ACTIVE_TITLE));

        mockMvc.perform(get("/api/customer-center/notices/{noticeId}", NOTICE_INACTIVE_ID).param("serviceType", NOTICE_SERVICE_TYPE))
            .andExpect(status().isNotFound());
    }

    @Test
    void noticeWritesRequireAuthzAndAdminCanCreate() throws Exception {
        seedNoticeFixtures();

        mockMvc.perform(post("/api/customer-center/notices")
                .contentType(MediaType.APPLICATION_JSON)
                .content(noticeJson(NOTICE_CREATED_TITLE, "Created excerpt", "Created notice content", true, false, NOTICE_SERVICE_TYPE)))
            .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/customer-center/notices")
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(noticeJson(NOTICE_CREATED_TITLE, "Created excerpt", "Created notice content", true, false, NOTICE_SERVICE_TYPE)))
            .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/customer-center/notices")
                .sessionAttr("user", sessionUser(SUPPORT_ADMIN_ID, "Support Admin", "ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(noticeJson(NOTICE_CREATED_TITLE, "Created excerpt", "Created notice content", true, false, NOTICE_SERVICE_TYPE)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.title").value(NOTICE_CREATED_TITLE))
            .andExpect(jsonPath("$.data.serviceType").value(NOTICE_SERVICE_TYPE));

        Long createdCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM notices WHERE title = ?",
            Long.class,
            NOTICE_CREATED_TITLE
        );
        assertThat(createdCount).isEqualTo(1L);
    }

    @Test
    void noticeUpdateAndDeleteAreVerifiedForAdmin() throws Exception {
        seedNoticeFixtures();

        mockMvc.perform(put("/api/customer-center/notices/{noticeId}", NOTICE_ACTIVE_ID)
                .sessionAttr("user", sessionUser(SUPPORT_ADMIN_ID, "Support Admin", "ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(noticeJson("Updated notice title", "Updated excerpt", "Updated notice content", true, false, NOTICE_SERVICE_TYPE)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.id").value(NOTICE_ACTIVE_ID))
            .andExpect(jsonPath("$.data.title").value("Updated notice title"))
            .andExpect(jsonPath("$.data.excerpt").value("Updated excerpt"))
            .andExpect(jsonPath("$.data.content").value("Updated notice content"))
            .andExpect(jsonPath("$.data.pinned").value(false))
            .andExpect(jsonPath("$.data.active").value(true));

        String updatedNoticeTitle = jdbcTemplate.queryForObject(
            "SELECT title FROM notices WHERE id = ?",
            String.class,
            NOTICE_ACTIVE_ID
        );
        Boolean noticeActive = jdbcTemplate.queryForObject(
            "SELECT is_active FROM notices WHERE id = ?",
            Boolean.class,
            NOTICE_ACTIVE_ID
        );
        assertThat(updatedNoticeTitle).isEqualTo("Updated notice title");
        assertThat(noticeActive).isTrue();

        mockMvc.perform(delete("/api/customer-center/notices/{noticeId}", NOTICE_ACTIVE_ID)
                .sessionAttr("user", sessionUser(SUPPORT_ADMIN_ID, "Support Admin", "ADMIN")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.id").value(NOTICE_ACTIVE_ID))
            .andExpect(jsonPath("$.data.entity").value("notice"));

        mockMvc.perform(get("/api/customer-center/notices/{noticeId}", NOTICE_ACTIVE_ID).param("serviceType", NOTICE_SERVICE_TYPE))
            .andExpect(status().isNotFound());

        Boolean deletedNoticeActive = jdbcTemplate.queryForObject(
            "SELECT is_active FROM notices WHERE id = ?",
            Boolean.class,
            NOTICE_ACTIVE_ID
        );
        assertThat(deletedNoticeActive).isFalse();
    }

    @Test
    void publicFaqEndpointsFilterByServiceTypeAndHideInactiveRows() throws Exception {
        seedFaqFixtures();

        mockMvc.perform(get("/api/customer-center/faqs").param("serviceType", FAQ_SERVICE_TYPE))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.data.length()").value(1))
            .andExpect(jsonPath("$.data[0].question").value(FAQ_ACTIVE_QUESTION));

        mockMvc.perform(get("/api/customer-center/faqs/{faqId}", FAQ_ACTIVE_ID).param("serviceType", FAQ_SERVICE_TYPE))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.question").value(FAQ_ACTIVE_QUESTION));

        mockMvc.perform(get("/api/customer-center/faqs/{faqId}", FAQ_INACTIVE_ID).param("serviceType", FAQ_SERVICE_TYPE))
            .andExpect(status().isNotFound());
    }

    @Test
    void faqWritesRequireAuthzAndAdminCanCreate() throws Exception {
        seedFaqFixtures();

        mockMvc.perform(post("/api/customer-center/faqs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(faqJson(FAQ_CREATED_QUESTION, "Created answer", "Created category", true, FAQ_SERVICE_TYPE)))
            .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/customer-center/faqs")
                .sessionAttr("user", sessionUser(SUPPORT_OWNER_ID, SUPPORT_OWNER_NAME, "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(faqJson(FAQ_CREATED_QUESTION, "Created answer", "Created category", true, FAQ_SERVICE_TYPE)))
            .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/customer-center/faqs")
                .sessionAttr("user", sessionUser(SUPPORT_ADMIN_ID, "Support Admin", "ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(faqJson(FAQ_CREATED_QUESTION, "Created answer", "Created category", true, FAQ_SERVICE_TYPE)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.question").value(FAQ_CREATED_QUESTION))
            .andExpect(jsonPath("$.data.serviceType").value(FAQ_SERVICE_TYPE));

        Long createdCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM faqs WHERE question = ?",
            Long.class,
            FAQ_CREATED_QUESTION
        );
        assertThat(createdCount).isEqualTo(1L);
    }

    @Test
    void faqUpdateAndDeleteAreVerifiedForAdmin() throws Exception {
        seedFaqFixtures();

        mockMvc.perform(put("/api/customer-center/faqs/{faqId}", FAQ_ACTIVE_ID)
                .sessionAttr("user", sessionUser(SUPPORT_ADMIN_ID, "Support Admin", "ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(faqJson("Updated FAQ?", "Updated answer", "Updated category", false, FAQ_SERVICE_TYPE)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.id").value(FAQ_ACTIVE_ID))
            .andExpect(jsonPath("$.data.question").value("Updated FAQ?"))
            .andExpect(jsonPath("$.data.answer").value("Updated answer"))
            .andExpect(jsonPath("$.data.category").value("Updated category"))
            .andExpect(jsonPath("$.data.sortOrder").value(1))
            .andExpect(jsonPath("$.data.active").value(false));

        String updatedFaqQuestion = jdbcTemplate.queryForObject(
            "SELECT question FROM faqs WHERE id = ?",
            String.class,
            FAQ_ACTIVE_ID
        );
        Boolean faqActive = jdbcTemplate.queryForObject(
            "SELECT is_active FROM faqs WHERE id = ?",
            Boolean.class,
            FAQ_ACTIVE_ID
        );
        assertThat(updatedFaqQuestion).isEqualTo("Updated FAQ?");
        assertThat(faqActive).isFalse();

        mockMvc.perform(delete("/api/customer-center/faqs/{faqId}", FAQ_ACTIVE_ID)
                .sessionAttr("user", sessionUser(SUPPORT_ADMIN_ID, "Support Admin", "ADMIN")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.id").value(FAQ_ACTIVE_ID))
            .andExpect(jsonPath("$.data.entity").value("faq"));

        mockMvc.perform(get("/api/customer-center/faqs/{faqId}", FAQ_ACTIVE_ID).param("serviceType", FAQ_SERVICE_TYPE))
            .andExpect(status().isNotFound());

        Boolean deletedFaqActive = jdbcTemplate.queryForObject(
            "SELECT is_active FROM faqs WHERE id = ?",
            Boolean.class,
            FAQ_ACTIVE_ID
        );
        assertThat(deletedFaqActive).isFalse();
    }

    private void seedSupportFixture() {
        seedSupportOwner();
        seedSupportCategory();
        seedSupportTicket();
    }

    private void seedSupportOwner() {
        jdbcTemplate.update(
            """
            INSERT INTO users (id, pw, name, phone, email, birth_date, gender, provider, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                pw = VALUES(pw),
                name = VALUES(name),
                phone = VALUES(phone),
                email = VALUES(email),
                birth_date = VALUES(birth_date),
                gender = VALUES(gender),
                provider = VALUES(provider),
                role = VALUES(role)
            """,
            SUPPORT_OWNER_ID,
            "encoded-password",
            SUPPORT_OWNER_NAME,
            SUPPORT_OWNER_PHONE,
            SUPPORT_OWNER_EMAIL,
            Date.valueOf(LocalDate.of(1991, 1, 1)),
            "M",
            "PASS",
            "USER"
        );
    }

    private void seedSupportCategory() {
        jdbcTemplate.update(
            """
            INSERT INTO support_categories (id, service_type, code, name, description, sort_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                service_type = VALUES(service_type),
                code = VALUES(code),
                name = VALUES(name),
                description = VALUES(description),
                sort_order = VALUES(sort_order),
                is_active = VALUES(is_active)
            """,
            SUPPORT_CATEGORY_ID,
            SUPPORT_SERVICE_TYPE,
            "booking",
            "Booking",
            "Booking support category",
            1,
            true
        );
    }

    private void seedSupportTicket() {
        jdbcTemplate.update(
            """
            INSERT INTO support_tickets (
                id, user_id, service_type, category_id, inquiry_type_code,
                requester_name, requester_email, requester_phone,
                title, content, status, priority
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                user_id = VALUES(user_id),
                service_type = VALUES(service_type),
                category_id = VALUES(category_id),
                inquiry_type_code = VALUES(inquiry_type_code),
                requester_name = VALUES(requester_name),
                requester_email = VALUES(requester_email),
                requester_phone = VALUES(requester_phone),
                title = VALUES(title),
                content = VALUES(content),
                status = VALUES(status),
                priority = VALUES(priority)
            """,
            SUPPORT_TICKET_ID,
            SUPPORT_OWNER_ID,
            SUPPORT_SERVICE_TYPE,
            SUPPORT_CATEGORY_ID,
            "booking",
            SUPPORT_OWNER_NAME,
            SUPPORT_OWNER_EMAIL,
            SUPPORT_OWNER_PHONE,
            "Original support ticket",
            "Original support content",
            "pending",
            "normal"
        );
    }

    private void seedNoticeFixtures() {
        jdbcTemplate.update(
            """
            INSERT INTO notices (
                id, service_type, title, excerpt, content, is_pinned, is_active, published_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                service_type = VALUES(service_type),
                title = VALUES(title),
                excerpt = VALUES(excerpt),
                content = VALUES(content),
                is_pinned = VALUES(is_pinned),
                is_active = VALUES(is_active),
                published_at = VALUES(published_at)
            """,
            NOTICE_ACTIVE_ID,
            NOTICE_SERVICE_TYPE,
            NOTICE_ACTIVE_TITLE,
            "active excerpt",
            "active notice content",
            true,
            true,
            Timestamp.valueOf(LocalDateTime.of(2026, 1, 1, 10, 0))
        );

        jdbcTemplate.update(
            """
            INSERT INTO notices (
                id, service_type, title, excerpt, content, is_pinned, is_active, published_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                service_type = VALUES(service_type),
                title = VALUES(title),
                excerpt = VALUES(excerpt),
                content = VALUES(content),
                is_pinned = VALUES(is_pinned),
                is_active = VALUES(is_active),
                published_at = VALUES(published_at)
            """,
            NOTICE_INACTIVE_ID,
            NOTICE_SERVICE_TYPE,
            NOTICE_INACTIVE_TITLE,
            "inactive excerpt",
            "inactive notice content",
            false,
            false,
            Timestamp.valueOf(LocalDateTime.of(2026, 1, 1, 9, 0))
        );
    }

    private void seedFaqFixtures() {
        jdbcTemplate.update(
            """
            INSERT INTO faqs (
                id, service_type, category, question, answer, sort_order, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                service_type = VALUES(service_type),
                category = VALUES(category),
                question = VALUES(question),
                answer = VALUES(answer),
                sort_order = VALUES(sort_order),
                is_active = VALUES(is_active)
            """,
            FAQ_ACTIVE_ID,
            FAQ_SERVICE_TYPE,
            "Booking",
            FAQ_ACTIVE_QUESTION,
            "active faq answer",
            1,
            true
        );

        jdbcTemplate.update(
            """
            INSERT INTO faqs (
                id, service_type, category, question, answer, sort_order, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                service_type = VALUES(service_type),
                category = VALUES(category),
                question = VALUES(question),
                answer = VALUES(answer),
                sort_order = VALUES(sort_order),
                is_active = VALUES(is_active)
            """,
            FAQ_INACTIVE_ID,
            FAQ_SERVICE_TYPE,
            "Booking",
            FAQ_INACTIVE_QUESTION,
            "inactive faq answer",
            2,
            false
        );
    }

    private SessionUser sessionUser(String id, String name, String role) {
        return new SessionUser(id, name, role);
    }

    private String supportTicketJson(String title, String content, String serviceType) {
        return supportTicketJson(title, content, serviceType, "pending", "normal");
    }

    private String supportTicketJson(String title, String content, String serviceType, String status, String priority) {
        return """
            {
              "serviceType": "%s",
              "categoryId": %d,
              "inquiryTypeCode": "booking",
              "requesterName": "%s",
              "requesterEmail": "%s",
              "requesterPhone": "%s",
              "title": "%s",
              "content": "%s",
              "status": "%s",
              "priority": "%s"
            }
            """.formatted(
            serviceType,
            SUPPORT_CATEGORY_ID,
            SUPPORT_OWNER_NAME,
            SUPPORT_OWNER_EMAIL,
            SUPPORT_OWNER_PHONE,
            title,
            content,
            status,
            priority
        );
    }

    private String commentJson(String content, boolean internal) {
        return """
            {
              "content": "%s",
              "isInternal": %s
            }
            """.formatted(content, internal);
    }

    private String attachmentJson(
        String originalFilename,
        String storedFilename,
        String storageKey,
        String contentType,
        long fileSizeBytes
    ) {
        return """
            {
              "originalFilename": "%s",
              "storedFilename": "%s",
              "storageKey": "%s",
              "contentType": "%s",
              "fileSizeBytes": %d
            }
            """.formatted(originalFilename, storedFilename, storageKey, contentType, fileSizeBytes);
    }

    private String noticeJson(
        String title,
        String excerpt,
        String content,
        boolean active,
        boolean pinned,
        String serviceType
    ) {
        return """
            {
              "serviceType": "%s",
              "title": "%s",
              "excerpt": "%s",
              "content": "%s",
              "active": %s,
              "pinned": %s,
              "publishedAt": "2026-01-01T10:00:00"
            }
            """.formatted(serviceType, title, excerpt, content, active, pinned);
    }

    private String faqJson(
        String question,
        String answer,
        String category,
        boolean active,
        String serviceType
    ) {
        return """
            {
              "serviceType": "%s",
              "category": "%s",
              "question": "%s",
              "answer": "%s",
              "sortOrder": 1,
              "active": %s
            }
            """.formatted(serviceType, category, question, answer, active);
    }
}
