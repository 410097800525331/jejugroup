import React, { useEffect, useMemo, useState } from "react";
import { resolveAvatarUrl } from "./data";
import { useDashboardState } from "./state";
import { useCompanionInvites } from "./useCompanionInvites";
import type { CompanionInviteItem } from "./types";

interface CompanionInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshPendingCount?: () => void | Promise<void>;
}

const formatInviteCountdown = (expiresAt: string | undefined, currentTimeMs: number) => {
  if (!expiresAt) {
    return "00:00:00";
  }

  const expiresAtMs = Date.parse(expiresAt);
  if (!Number.isFinite(expiresAtMs)) {
    return "00:00:00";
  }

  const remainingMs = Math.max(0, expiresAtMs - currentTimeMs);
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
};

const InviteAvatar = ({ invite }: { invite: CompanionInviteItem }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const avatarUrl = resolveAvatarUrl(invite.senderAvatarUrl);
  const showImage = Boolean(avatarUrl && !imageFailed);

  useEffect(() => {
    setImageFailed(false);
  }, [avatarUrl]);

  return (
    <div className="companion-invite-avatar companion-avatar soft-radius is-linked" aria-hidden="true">
      {showImage ? (
        <img
          alt=""
          className="companion-invite-avatar-image"
          onError={() => setImageFailed(true)}
          src={avatarUrl}
        />
      ) : (
        <span className="companion-invite-avatar-fallback">
          {invite.senderName.charAt(0)}
        </span>
      )}
      <i data-lucide="bell-ring" className="lucide-bell-ring linked-indicator companion-invite-avatar-badge" />
    </div>
  );
};

export const CompanionInviteModal = ({
  isOpen,
  onClose,
  onRefreshPendingCount,
}: CompanionInviteModalProps) => {
  const { refreshDashboard } = useDashboardState();
  const {
    acceptInvite,
    errorObj,
    isLoading,
    pendingInviteCount,
    pendingReceivedInvites,
    rejectInvite,
  } = useCompanionInvites({ enabled: isOpen });
  const [actionInviteId, setActionInviteId] = useState<number | null>(null);
  const [currentTimeMs, setCurrentTimeMs] = useState(() => Date.now());

  useEffect(() => {
    if (isOpen && window.lucide) {
      window.lucide.createIcons();
    }
  }, [isOpen, pendingReceivedInvites, isLoading, errorObj, pendingInviteCount]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || pendingReceivedInvites.length === 0) {
      return undefined;
    }

    setCurrentTimeMs(Date.now());
    const timerId = window.setInterval(() => {
      setCurrentTimeMs(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [isOpen, pendingReceivedInvites.length]);

  const sortedInvites = useMemo(
    () => [...pendingReceivedInvites].sort((left, right) => {
      const leftTime = left.createdAt ?? left.expiresAt ?? "";
      const rightTime = right.createdAt ?? right.expiresAt ?? "";
      return rightTime.localeCompare(leftTime);
    }),
    [pendingReceivedInvites],
  );

  if (!isOpen) {
    return null;
  }

  const handleAction = async (inviteId: number, action: "accept" | "reject") => {
    if (actionInviteId !== null) {
      return;
    }

    setActionInviteId(inviteId);
    try {
      const success = action === "accept" ? await acceptInvite(inviteId) : await rejectInvite(inviteId);
      if (success) {
        await refreshDashboard();
        await onRefreshPendingCount?.();
      }
    } finally {
      setActionInviteId(null);
    }
  };

  const handleBackdropClick = () => {
    onClose();
  };

  const handlePanelClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div className="meta-modal-overlay companion-invite-modal active" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div
        className="meta-modal-content companion-invite-modal-content soft-radius meta-glass-theme"
        onClick={handlePanelClick}
      >
        <header className="modal-header companion-invite-modal-header">
          <div className="header-title-wrap">
            <i data-lucide="bell" className="lucide-bell" />
            <h3>동행자 초대함</h3>
          </div>
          <button className="close-btn" type="button" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </header>

        <p className="modal-desc companion-invite-modal-desc">
          받은 동행자 초대를 확인하고 수락하거나 거절해라.
        </p>

        <div className="companion-invite-modal-body">
          <div className="companion-invite-summary">
            <strong>받은 초대</strong>
            <span>{pendingInviteCount}건</span>
          </div>

          <div className="companion-invite-panel">
            {errorObj ? (
              <div className="error-message companion-invite-error">
                <i data-lucide="alert-circle" className="lucide-alert-circle" />
                {errorObj.message}
              </div>
            ) : isLoading ? (
              <p className="empty-list companion-invite-empty">초대 목록을 불러오는 중이다.</p>
            ) : sortedInvites.length === 0 ? (
              <p className="empty-list companion-invite-empty">받은 동행자 초대가 없다.</p>
            ) : (
              <div className="companion-invite-list companion-list-scroll">
                {sortedInvites.map((invite) => (
                  <div className="companion-invite-row list-item soft-radius" key={invite.id}>
                    <div className="item-info companion-invite-row-info">
                      <InviteAvatar invite={invite} />
                      <div className="user-info name-meta companion-invite-copy">
                        <div
                          style={{
                            alignItems: "center",
                            display: "flex",
                            gap: "10px",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <strong>{invite.senderName}</strong>
                          <span
                            style={{
                              color: "#ff5000",
                              flex: "0 0 auto",
                              fontSize: "12px",
                              fontWeight: 800,
                              lineHeight: 1,
                            }}
                          >
                            {formatInviteCountdown(invite.expiresAt, currentTimeMs)}
                          </span>
                        </div>
                        <span>{invite.senderBio?.trim() || `@${invite.senderUserId}`}</span>
                      </div>
                    </div>

                    <div className="companion-invite-actions">
                      <button
                        className="companion-invite-action companion-invite-reject"
                        type="button"
                        onClick={() => void handleAction(invite.id, "reject")}
                        disabled={actionInviteId !== null}
                      >
                        거절
                      </button>
                      <button
                        className="companion-invite-action companion-invite-accept"
                        type="button"
                        onClick={() => void handleAction(invite.id, "accept")}
                        disabled={actionInviteId !== null}
                      >
                        수락
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <footer className="modal-footer companion-invite-modal-footer">
          <button className="cancel-btn pill-shape" type="button" onClick={onClose}>
            닫기
          </button>
        </footer>
      </div>
    </div>
  );
};
