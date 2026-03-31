package com.jejugroup.jejuspring.chat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ChatApiController.class)
class ChatApiControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ChatService chatService;

    @Test
    void statusReturnsOnlineWhenConfigured() throws Exception {
        when(chatService.isConfigured()).thenReturn(true);

        mockMvc.perform(get("/api/chat"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.status").value("online"))
            .andExpect(jsonPath("$.data.configured").value(true));
    }

    @Test
    void chatReturnsRawUpstreamPayloadOnSuccess() throws Exception {
        when(chatService.forward(anyString())).thenReturn("""
            {"candidates":[{"content":{"parts":[{"text":"안녕하세요"}]}}]}
            """);

        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "messages": [
                        {"role": "system", "content": "You are Jeju Group Assistant"},
                        {"role": "user", "content": "안녕하세요"}
                      ]
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(content().json("""
                {"candidates":[{"content":{"parts":[{"text":"안녕하세요"}]}}]}
                """));
    }

    @Test
    void statusReturnsServiceUnavailableWhenNotConfigured() throws Exception {
        when(chatService.isConfigured()).thenReturn(false);

        mockMvc.perform(get("/api/chat"))
            .andExpect(status().isServiceUnavailable())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void chatReturnsOpaqueFailurePayloadWhenUpstreamIsUnavailable() throws Exception {
        when(chatService.forward(anyString())).thenThrow(new ChatUpstreamException());

        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"messages":[{"role":"user","content":"안녕하세요"}]}
                    """))
            .andExpect(status().isBadGateway())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").exists());
    }
}
