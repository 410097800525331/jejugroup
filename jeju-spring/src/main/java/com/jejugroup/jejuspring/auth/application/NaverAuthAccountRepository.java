package com.jejugroup.jejuspring.auth.application;

import java.sql.SQLException;

import com.jejugroup.jejuspring.auth.model.SessionUser;

public interface NaverAuthAccountRepository {
    SessionUser resolveOrLinkExistingUser(String providerAccountId, String providerEmail) throws SQLException;
}
