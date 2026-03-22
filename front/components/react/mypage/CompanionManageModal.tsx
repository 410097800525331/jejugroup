import React, { useEffect, useRef } from "react";
import { useCompanionManager } from "./useCompanionManager";
import type { ItineraryCompanion } from "./types";

interface CompanionManageModalProps {
  initialCompanions: ItineraryCompanion[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (newCompanions: ItineraryCompanion[]) => void;
}

export const CompanionManageModal = ({
  initialCompanions,
  isOpen,
  onClose,
  onSave,
}: CompanionManageModalProps) => {
  const {
    companions,
    searchQuery,
    setSearchQuery,
    searchResult,
    isSearching,
    errorObj,
    handleSearch,
    addCompanion,
    removeCompanion,
    clearSearch,
  } = useCompanionManager({ initialCompanions });

  const inputRef = useRef<HTMLInputElement>(null);
  const isSearchResultLinked = searchResult ? companions.some((companion) => companion.id === searchResult.id) : false;

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
  }, [isOpen, searchResult, companions, errorObj]);

  if (!isOpen) return null;

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleApplyParams = () => {
    onSave(companions);
    onClose();
  };

  return (
    <div className="meta-modal-overlay companion-manage-modal active" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="meta-modal-content companion-modal-content soft-radius meta-glass-theme" 
        onClick={(e) => e.stopPropagation()}
        style={{ padding: "40px" }}
      >
        <header className="modal-header">
          <div className="header-title-wrap">
            <h3>동행자 연동 / 관리</h3>
          </div>
        </header>

        <div className="companion-modal-body">
          <form className="companion-search-form id-search-wrap" onSubmit={handleSubmitSearch} style={{ gap: "16px", marginBottom: "32px" }}>
            <input
              ref={inputRef}
              className="id-input companion-search-input"
              type="text"
              placeholder="제주그룹 회원 ID를 입력해라"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: "18px 24px", fontSize: "16px", borderRadius: "12px" }}
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="add-btn companion-search-submit pill-shape" 
              disabled={isSearching}
              style={{ padding: "0 40px", fontSize: "16px" }}
            >
              {isSearching ? "검색 중..." : "검색"}
            </button>
          </form>

          {errorObj && (
            <div className="error-message" style={{ color: "red", fontSize: "13px", marginBottom: "16px", fontWeight: 600 }}>
              <i data-lucide="alert-circle" style={{ marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" }} />
              {errorObj.message}
            </div>
          )}

          {searchResult && (
            <div className="search-result-wrap list-item" style={{ padding: "20px 24px", marginBottom: "32px", borderRadius: "16px" }}>
              <div className="companion-result-item item-info">
                <div className="companion-avatar soft-radius is-linked" style={{ width: "48px", height: "48px", fontSize: "18px", marginLeft: 0 }}>
                  {searchResult.name.charAt(0)}
                  <i data-lucide="link" className="lucide-link linked-indicator" />
                </div>
                <div className="user-info name-meta" style={{ gap: "4px" }}>
                  <strong style={{ fontSize: "16px" }}>{searchResult.name}</strong>
                  <span style={{ fontSize: "14px" }}>@{searchResult.id}</span>
                  <span style={{ fontSize: "13px", color: "var(--meta-text-muted)" }}>
                    {isSearchResultLinked ? "이미 연동된 제주그룹 회원" : "연동 가능한 제주그룹 회원"}
                  </span>
                </div>
              </div>
              <button 
                className="add-btn companion-add-btn pill-shape" 
                type="button" 
                onClick={() => addCompanion(searchResult)}
                disabled={isSearchResultLinked}
                style={{ padding: "12px 28px", fontSize: "14px" }}
              >
                {isSearchResultLinked ? "연동됨" : "추가"}
              </button>
            </div>
          )}

          <div className="linked-companions-section">
            <h4 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "20px", color: "var(--meta-text-main)" }}>
              연동된 동행자 ({companions.length}명)
            </h4>
            {companions.length === 0 ? (
              <p className="empty-list" style={{ padding: "48px 20px", fontSize: "15px" }}>
                아직 연동된 동행자가 없다. 제주그룹 회원 ID를 검색해서 추가해라.
              </p>
            ) : (
              <div className="companion-linked-list companion-list-scroll" style={{ gap: "16px", maxHeight: "280px" }}>
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
                    <button 
                      className="remove-btn companion-remove-btn" 
                      onClick={() => removeCompanion(comp.id)}
                      style={{ padding: "10px 24px", fontSize: "14px" }}
                    >
                      해제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <footer className="modal-footer" style={{ marginTop: "40px", gap: "16px" }}>
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
