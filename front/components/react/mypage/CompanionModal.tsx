import React, { useEffect, useState } from "react";
import type { ItineraryCompanion } from "./types";

declare global {
  interface Window {
    lucide?: {
      createIcons: () => void;
    };
  }
}

interface CompanionModalProps {
  initialCompanions: ItineraryCompanion[];
  onClose: () => void;
  onSave: (newCompanions: ItineraryCompanion[]) => void;
}

export const CompanionModal = ({ initialCompanions, onClose, onSave }: CompanionModalProps) => {
  const [list, setList] = useState<ItineraryCompanion[]>(initialCompanions);
  const [newId, setNewId] = useState("");

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [list]);

  const handleAdd = () => {
    if (!newId.trim()) return;
    const newComp: ItineraryCompanion = {
      id: `comp-new-${Date.now()}`,
      isMember: true, // 로직상 연동 시도는 항상 멤버로 가정
      name: `사용자(${newId})`,
    };
    setList((current) => [...current, newComp]);
    setNewId("");
  };

  const handleRemove = (id: string) => {
    setList((current) => current.filter((c) => c.id !== id));
  };

  return (
    <div className="meta-modal-overlay companion-modal-overlay" onClick={onClose}>
      <div className="meta-modal-content soft-radius meta-glass-theme companion-modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="companion-modal-header">
          <div className="companion-modal-title-wrap">
            <i className="lucide-user-plus" />
            <h3>동행자 연동/관리</h3>
          </div>
          <button className="close-btn companion-modal-close-btn" type="button" onClick={onClose}>
            <i className="lucide-x" />
          </button>
        </header>

        <p className="companion-modal-desc">함께 여행할 멤버의 제주항공 아이디를 입력하여 연동하세요.</p>

        <div className="companion-modal-input-row">
          <input
            className="id-input companion-modal-input"
            placeholder="제주항공 아이디 입력 (예: jeju123)"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button className="add-btn pill-shape companion-modal-add-btn" type="button" onClick={handleAdd}>
            추가
          </button>
        </div>

        <div className="companion-modal-list-panel">
          <span className="companion-modal-list-label">현재 연동된 동행자 ({list.length}명)</span>
          <div className="companion-modal-list-scroll">
            {list.map((comp) => (
              <div className="companion-modal-list-item" key={comp.id}>
                <div className="companion-modal-item-info">
                  <div className={`companion-avatar soft-radius ${comp.isMember ? "is-linked" : ""}`}>
                    {comp.name.charAt(0)}
                    {comp.isMember && <i data-lucide="link" className="lucide-link linked-indicator" />}
                  </div>
                  <div className="companion-modal-name-meta">
                    <strong>{comp.name}</strong>
                    <span>{comp.isMember ? "멤버십 연동됨" : "비회원"}</span>
                  </div>
                </div>

                <button className="remove-btn companion-modal-remove-btn" type="button" onClick={() => handleRemove(comp.id)}>
                  삭제
                </button>
              </div>
            ))}
            {list.length === 0 && <div className="companion-modal-empty">동행자가 없습니다.</div>}
          </div>
        </div>

        <footer className="companion-modal-footer">
          <button className="cancel-btn pill-shape companion-modal-cancel-btn" type="button" onClick={onClose}>
            취소
          </button>
          <button
            className="save-btn pill-shape companion-modal-save-btn"
            type="button"
            onClick={() => {
              onSave(list);
              onClose();
            }}
          >
            저장 및 적용
          </button>
        </footer>
      </div>
    </div>
  );
};
