import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCompanionManager } from "./useCompanionManager";
import type { ItineraryCompanion } from "./types";

interface CompanionManageModalProps {
  initialCompanions: ItineraryCompanion[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (newCompanions: ItineraryCompanion[]) => void;
}

interface CompanionCardProps {
  companion: ItineraryCompanion;
  isLinked: boolean;
  showActionBadge: boolean;
  showLinkedBadge?: boolean;
  onSelect: (companion: ItineraryCompanion) => void;
}

const CompanionAvatar = ({
  companion,
}: {
  companion: ItineraryCompanion;
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(companion.avatarUrl && !imageFailed);

  return (
    <div
      aria-hidden="true"
      className="companion-avatar soft-radius is-linked companion-search-avatar"
      data-companion-search-avatar="true"
    >
      {showImage ? (
        <img
          alt=""
          src={companion.avatarUrl}
          onError={() => setImageFailed(true)}
          className="companion-search-avatar-image"
        />
      ) : (
        <span className="companion-search-avatar-fallback">
          {companion.name.charAt(0)}
        </span>
      )}
      <i data-lucide="link" className="lucide-link linked-indicator companion-search-avatar-link" />
    </div>
  );
};

const CompanionSearchCard = ({ companion, isLinked, showActionBadge, showLinkedBadge, onSelect }: CompanionCardProps) => {
  const bioText = companion.bio?.trim() || `@${companion.id}`;

  return (
    <button
      className="companion-linked-item list-item soft-radius companion-search-card"
      type="button"
      onClick={() => onSelect(companion)}
      disabled={isLinked}
      data-linked={isLinked ? "true" : "false"}
    >
      <div className="item-info companion-search-card-info">
        <CompanionAvatar companion={companion} />
        <div className="user-info name-meta companion-search-card-copy">
          <strong>{companion.name}</strong>
          <span>{bioText}</span>
        </div>
      </div>

      {showActionBadge ? (
        <span className="pill-shape companion-search-card-badge" data-linked={isLinked ? "true" : "false"}>
          {isLinked ? "연동됨" : "추가"}
        </span>
      ) : showLinkedBadge && isLinked ? (
        <span className="pill-shape companion-search-card-badge" data-linked="true">
          연동됨
        </span>
      ) : null}
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
    addCompanion,
    removeCompanion,
    clearSearch,
  } = useCompanionManager({ initialCompanions });

  const inputRef = useRef<HTMLInputElement>(null);
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

  const handleApplyParams = () => {
    onSave(companions);
    onClose();
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
                  onSelect={addCompanion}
                  showActionBadge
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
            onSelect={addCompanion}
            showActionBadge={false}
            showLinkedBadge
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
                  아직 연동된 동행자가 없다. 제주그룹 회원 ID를 검색해서 추가해라.
                </p>
              ) : (
                <div className="companion-linked-list companion-list-scroll" style={{ display: "flex", flex: "1 1 auto", flexDirection: "column", gap: "16px", minHeight: 0, overflowY: "auto", paddingRight: "4px" }}>
                  {companions.map((comp) => (
                    <div key={comp.id} className="companion-linked-item list-item" style={{ padding: "12px 20px", borderRadius: "16px" }}>
                      <div className="item-info">
                        <div className={`companion-avatar soft-radius ${comp.isMember ? "is-linked" : ""}`} style={{ width: "40px", height: "40px", fontSize: "15px", marginLeft: 0 }}>
                          {comp.name.charAt(0)}
                          {comp.isMember && <i data-lucide="link" className="lucide-link linked-indicator" style={{ width: "14px", height: "14px" }} />}
                        </div>
                        <div className="user-info name-meta">
                          <strong style={{ fontSize: "16px" }}>{comp.name}</strong>
                          <span style={{ fontSize: "13px", color: "var(--meta-text-muted)" }}>@{comp.id}</span>
                        </div>
                      </div>
                      <button className="remove-btn companion-remove-btn" onClick={() => removeCompanion(comp.id)} style={{ padding: "10px 24px", fontSize: "14px" }}>
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
          <button className="save-btn pill-shape" type="button" onClick={handleApplyParams} style={{ padding: "20px 0", fontSize: "16px" }}>
            적용
          </button>
        </footer>
      </div>
    </div>
  );
};
