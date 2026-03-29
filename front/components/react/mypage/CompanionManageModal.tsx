import React, { useEffect, useMemo, useRef, useState } from "react";
import { resolveAvatarUrl } from "./data";
import { useCompanionManager } from "./useCompanionManager";
import type { CompanionRelationState, ItineraryCompanion } from "./types";

interface CompanionManageModalProps {
  initialCompanions: ItineraryCompanion[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (newCompanions: ItineraryCompanion[]) => void;
}

interface CompanionCardProps {
  companion: ItineraryCompanion;
  isLinked: boolean;
  onInvite: (companion: ItineraryCompanion) => void;
}

const CompanionAvatar = ({
  companion,
  className = "",
  showLinkedIndicator = true,
  style,
}: {
  companion: ItineraryCompanion;
  className?: string;
  showLinkedIndicator?: boolean;
  style?: React.CSSProperties;
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const avatarUrl = resolveAvatarUrl(companion.avatarUrl);
  const showImage = Boolean(avatarUrl && !imageFailed);

  useEffect(() => {
    setImageFailed(false);
  }, [avatarUrl]);

  return (
    <div
      aria-hidden="true"
      className={`companion-avatar soft-radius companion-search-avatar ${showLinkedIndicator ? "is-linked" : ""} ${className}`.trim()}
      data-companion-search-avatar="true"
      style={style}
    >
      {showImage ? (
        <img
          alt=""
          src={avatarUrl}
          onError={() => setImageFailed(true)}
          className="companion-search-avatar-image"
        />
      ) : (
        <span className="companion-search-avatar-fallback">
          {companion.name.charAt(0)}
        </span>
      )}
      {showLinkedIndicator ? (
        <i data-lucide="link" className="lucide-link linked-indicator companion-search-avatar-link" />
      ) : null}
    </div>
  );
};

const RELATION_BADGE_LABELS: Record<CompanionRelationState, string> = {
  incoming_pending: "응답 필요",
  linked: "연동됨",
  none: "초대",
  outgoing_pending: "초대중",
};

const resolveRelationState = (companion: ItineraryCompanion, isLinked: boolean): CompanionRelationState =>
  isLinked ? "linked" : companion.relationState ?? "none";

const getRelationBadgeLabel = (relationState: CompanionRelationState) => RELATION_BADGE_LABELS[relationState];

const CompanionSearchCard = ({ companion, isLinked, onInvite }: CompanionCardProps) => {
  const bioText = companion.bio?.trim() || `@${companion.id}`;
  const relationState = resolveRelationState(companion, isLinked);
  const isInviteActionable = relationState === "none";
  const badgeLabel = getRelationBadgeLabel(relationState);

  return (
    <button
      className="companion-linked-item list-item soft-radius companion-search-card"
      type="button"
      onClick={() => {
        if (isInviteActionable) {
          onInvite(companion);
        }
      }}
      disabled={!isInviteActionable}
      data-linked={isLinked ? "true" : "false"}
      data-relation-state={relationState}
    >
      <div className="item-info companion-search-card-info">
        <CompanionAvatar companion={companion} showLinkedIndicator={relationState === "linked"} />
        <div className="user-info name-meta companion-search-card-copy">
          <strong>{companion.name}</strong>
          <span>{bioText}</span>
        </div>
      </div>

      <span className="pill-shape companion-search-card-badge" data-linked={isLinked ? "true" : "false"}>
        {badgeLabel}
      </span>
    </button>
  );
};

export const CompanionManageModal = ({
  initialCompanions,
  isOpen,
  onClose,
  onSave,
}: CompanionManageModalProps) => {
  const {
    companions,
    searchMode,
    searchQuery,
    searchResults,
    setSearchQuery,
    isSearching,
    errorObj,
    handleSearch,
    inviteCompanion,
    commitPendingUnlinks,
    removeCompanion,
    clearSearch,
  } = useCompanionManager({ initialCompanions });

  const inputRef = useRef<HTMLInputElement>(null);
  const [isApplying, setIsApplying] = useState(false);
  const suggestionLimit = 4;
  const hasSearchText = searchQuery.trim().length > 0;
  const visibleSearchResults = useMemo(
    () => searchResults.slice(0, suggestionLimit),
    [searchResults],
  );

  useEffect(() => {
    if (isOpen) {
      clearSearch();
      const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 100);
      return () => window.clearTimeout(focusTimer);
    }
  }, [isOpen, clearSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && window.lucide) {
      window.lucide.createIcons();
    }
  }, [isOpen, searchMode, searchResults, companions, errorObj]);

  if (!isOpen) return null;

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleApplyParams = async () => {
    setIsApplying(true);
    try {
      await commitPendingUnlinks();
      onSave(companions);
      onClose();
    } catch {
      return;
    } finally {
      setIsApplying(false);
    }
  };

  const isCompanionLinked = (companionId: string) => companions.some((companion) => companion.id === companionId);

  const renderSearchResults = () => {
    if (searchMode !== "results") {
      return null;
    }

    return (
      <div className="companion-search-results-panel">
        {errorObj ? (
          <div className="error-message" style={{ color: "red", fontSize: "13px", fontWeight: 600 }}>
            <i data-lucide="alert-circle" style={{ marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" }} />
            {errorObj.message}
          </div>
        ) : isSearching ? (
          <p className="empty-list" style={{ padding: "28px 20px", fontSize: "14px" }}>
            제주그룹 회원을 찾는 중이다.
          </p>
        ) : searchResults.length === 0 ? (
          <p className="empty-list" style={{ padding: "28px 20px", fontSize: "14px" }}>
            일치하는 제주그룹 회원이 없다.
          </p>
        ) : (
          <>
            <div style={{ color: "var(--meta-text-muted)", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>
              검색 결과 {searchResults.length}명
            </div>
            <div className="companion-search-results-list">
              {searchResults.map((companion) => (
                <CompanionSearchCard
                  key={companion.id}
                  companion={companion}
                  isLinked={isCompanionLinked(companion.id)}
                  onInvite={inviteCompanion}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderSuggestionList = () => {
    if (searchMode === "results") {
      return null;
    }

    if (visibleSearchResults.length === 0) {
      return null;
    }

    return (
      <div className="companion-search-dropdown">
        {visibleSearchResults.map((companion) => (
          <CompanionSearchCard
            key={companion.id}
            companion={companion}
            isLinked={isCompanionLinked(companion.id)}
            onInvite={inviteCompanion}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="meta-modal-overlay companion-manage-modal active" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="meta-modal-content companion-modal-content soft-radius meta-glass-theme"
        onClick={(e) => e.stopPropagation()}
        style={{ display: "flex", flexDirection: "column", overflow: "hidden", padding: "40px" }}
      >
        <header className="modal-header">
          <div className="header-title-wrap">
            <h3>동행자 연동 / 관리</h3>
          </div>
        </header>

        <div className="companion-modal-body" style={{ display: "flex", flex: "1 1 auto", flexDirection: "column", gap: "24px", minHeight: 0, overflow: "hidden" }}>
          <form className="companion-search-form id-search-wrap" onSubmit={handleSubmitSearch} style={{ gap: "16px", marginBottom: "0", flexShrink: 0 }}>
            <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: "12px", minWidth: 0, position: "relative" }}>
              <input
                ref={inputRef}
                className="id-input companion-search-input"
                type="text"
                placeholder="제주그룹 회원 ID를 입력해라"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: "18px 24px", fontSize: "16px", borderRadius: "12px", width: "100%" }}
                autoComplete="off"
              />
              <div style={{ left: 0, position: "absolute", right: 0, top: "calc(100% - 1px)", zIndex: 3 }}>
                {renderSuggestionList()}
              </div>
            </div>
          <button
            type="submit"
            className="add-btn companion-search-submit pill-shape"
            disabled={isSearching}
                style={{
                  background: hasSearchText ? "#ff7a00" : "#eef1f4",
                  border: hasSearchText ? "1px solid #ff7a00" : "1px solid #d7dce2",
                boxShadow: "none",
                color: hasSearchText ? "#fff" : "#7b8794",
                padding: "0 36px",
                fontSize: "16px",
                borderRadius: "16px",
                flexShrink: 0,
                }}
            >
              {isSearching ? "검색 중..." : "검색"}
            </button>
          </form>

          {searchMode === "results" ? renderSearchResults() : null}

          {errorObj && searchMode !== "results" && (
            <div className="error-message" style={{ color: "red", fontSize: "13px", marginBottom: "16px", fontWeight: 600 }}>
              <i data-lucide="alert-circle" style={{ marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" }} />
              {errorObj.message}
            </div>
          )}

          {searchMode !== "results" && (
            <div className="linked-companions-section" style={{ display: "flex", flex: "1 1 auto", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
              <h4 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "20px", color: "var(--meta-text-main)" }}>
                연동된 동행자 ({companions.length}명)
              </h4>
              {companions.length === 0 ? (
                <p className="empty-list" style={{ padding: "48px 20px", fontSize: "15px" }}>
                  아직 연동된 동행자가 없다. 제주그룹 회원 ID를 검색해서 초대해라.
                </p>
              ) : (
                <div className="companion-linked-list companion-list-scroll" style={{ display: "flex", flex: "1 1 auto", flexDirection: "column", gap: "16px", minHeight: 0, overflowY: "auto", paddingRight: "4px" }}>
                  {companions.map((comp) => (
                    <div key={comp.id} className="companion-linked-item list-item" style={{ padding: "12px 20px", borderRadius: "16px" }}>
                      <div className="item-info">
                        <CompanionAvatar
                          companion={comp}
                          className="companion-linked-avatar"
                          showLinkedIndicator={comp.isMember}
                          style={{ width: "40px", height: "40px", fontSize: "15px", marginLeft: 0 }}
                        />
                        <div className="user-info name-meta">
                          <strong style={{ fontSize: "16px" }}>{comp.name}</strong>
                          <span style={{ fontSize: "13px", color: "var(--meta-text-muted)" }}>@{comp.id}</span>
                        </div>
                      </div>
                      <button
                        className="remove-btn companion-remove-btn"
                        type="button"
                        onClick={() => void removeCompanion(comp.id)}
                        style={{ padding: "10px 24px", fontSize: "14px" }}
                      >
                        해제
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <footer className="modal-footer" style={{ marginTop: "24px", gap: "16px", flexShrink: 0 }}>
          <button className="cancel-btn pill-shape" type="button" onClick={onClose} style={{ padding: "20px 0", fontSize: "16px" }}>
            취소
          </button>
          <button
            className="save-btn pill-shape"
            type="button"
            onClick={() => void handleApplyParams()}
            disabled={isApplying}
            style={{ padding: "20px 0", fontSize: "16px" }}
          >
            {isApplying ? "적용 중" : "적용"}
          </button>
        </footer>
      </div>
    </div>
  );
};
