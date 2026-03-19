package dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class InquiryDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private long id;
    private String title;
    private String content;
    private String service;
    private String status;
    private String createdAt;
}
