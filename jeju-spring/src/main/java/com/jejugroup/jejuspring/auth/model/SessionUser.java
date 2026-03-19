package com.jejugroup.jejuspring.auth.model;

import java.io.Serializable;

public record SessionUser(
    String id,
    String name,
    String role
) implements Serializable {
    private static final long serialVersionUID = 1L;
}
