import React, { useState } from "react";
import type { ItineraryCompanion } from "./types";

interface CompanionModalProps {
  initialCompanions: ItineraryCompanion[];
  onClose: () => void;
  onSave: (newCompanions: ItineraryCompanion[]) => void;
}

export const CompanionModal = ({ initialCompanions, onClose, onSave }: CompanionModalProps) => {
  const [list, setList] = useState<ItineraryCompanion[]>(initialCompanions);
  const [newId, setNewId] = useState("");

  const handleAdd = () => {
    if (!newId.trim()) return;
    const newComp: ItineraryCompanion = {
      id: `comp-new-${Date.now()}`,
      isMember: true, // 로직상 연동 시도는 항상 멤버로 가정
      name: `사용자(${newId})`,
    };
    setList([...list, newComp]);
    setNewId("");
  };

  const handleRemove = (id: string) => {
    setList(list.filter((c) => c.id !== id));
  };

  return (
    <div className="meta-modal-overlay" onClick={onClose}>
      <div className="meta-modal-content soft-radius meta-glass-theme" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="header-title-wrap">
            <i className="lucide-user-plus" />
            <h3>동행자 연동/관리</h3>
          </div>
          <button className="close-btn" onClick={onClose}><i className="lucide-x" /></button>
        </header>

        <p className="modal-desc">함께 여행할 멤버의 제주항공 아이디를 입력하여 연동하세요.</p>

        <div className="id-search-wrap">
          <input 
            className="id-input" 
            placeholder="제주항공 아이디 입력 (예: jeju123)" 
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button className="add-btn pill-shape" onClick={handleAdd}>추가</button>
        </div>

        <div className="companion-list-container">
          <span className="small-label">현재 연동된 동행자 ({list.length}명)</span>
          <div className="companion-list-scroll">
            {list.map((comp) => (
              <div className="list-item" key={comp.id}>
                <div className="item-info">
                  <div className={`companion-avatar soft-radius ${comp.isMember ? "is-linked" : ""}`}>
                    {comp.name.charAt(0)}
                    {comp.isMember && <i className="lucide-link linked-indicator" />}
                  </div>
                  <div className="name-meta">
                    <strong>{comp.name}</strong>
                    <span>{comp.isMember ? '멤버십 연동됨' : '비회원'}</span>
                  </div>
                </div>

                <button className="remove-btn" onClick={() => handleRemove(comp.id)}>삭제</button>
              </div>
            ))}
            {list.length === 0 && <div className="empty-list">동행자가 없습니다.</div>}
          </div>
        </div>

        <footer className="modal-footer">
          <button className="cancel-btn pill-shape" onClick={onClose}>취소</button>
          <button className="save-btn pill-shape" onClick={() => { onSave(list); onClose(); }}>저장 및 적용</button>
        </footer>
      </div>
    </div>
  );
};
