import { getServiceLabel } from "@/data/serviceCenterData";
import type { InquiryRecord } from "@/types/service-center";
import "@/styles/bbs.css";

interface InquiryDetailProps {
  inquiry: InquiryRecord;
  isDeleting?: boolean;
  onBack: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export default function InquiryDetail({ inquiry, isDeleting = false, onBack, onDelete, onEdit }: InquiryDetailProps) {
  return (
    <div className="bbs-container">
      <header className="bbs-header">
        <h1>문의 상세</h1>
        <p>문의 내용을 확인하고 수정하거나 삭제할 수 있습니다.</p>
      </header>

      <article className="bbs-detail-card">
        <div className="bbs-detail-meta">
          <span className="bbs-service-chip">{getServiceLabel(inquiry.service)}</span>
          <span className={`bbs-status-pill ${inquiry.status === "completed" ? "is-completed" : ""}`}>
            {inquiry.status === "completed" ? "답변완료" : "답변대기"}
          </span>
          <span className="bbs-item-date">{inquiry.date}</span>
        </div>

        <h2 className="bbs-detail-title">{inquiry.title}</h2>
        <div className="bbs-detail-body">{inquiry.content}</div>

        <div className="bbs-detail-actions">
          <button type="button" className="bbs-secondary-btn" onClick={onBack}>
            목록
          </button>
          <button type="button" className="bbs-write-btn" onClick={onEdit}>
            수정
          </button>
          <button type="button" className="bbs-danger-btn" onClick={onDelete} disabled={isDeleting}>
            {isDeleting ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </article>
    </div>
  );
}
