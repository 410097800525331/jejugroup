import { ChevronRight } from "lucide-react";

import { getServiceLabel } from "@/data/serviceCenterData";
import type { InquiryRecord } from "@/types/service-center";
import "@/styles/bbs.css";

interface InquiryListItemProps extends InquiryRecord {
  onClick: () => void;
}

export default function InquiryListItem({ date, onClick, service, status, title }: InquiryListItemProps) {
  return (
    <button type="button" className="bbs-item" onClick={onClick}>
      <div className="bbs-item-content">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
          <span className="bbs-service-chip">{getServiceLabel(service)}</span>
          <span className="bbs-item-title">{title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span className="bbs-item-date">{date}</span>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: status === "completed" ? "#10b981" : "#94a3b8",
            }}
          >
            {status === "completed" ? "답변완료" : "답변대기"}
          </span>
        </div>
      </div>
      <ChevronRight size={20} className="bbs-item-chevron" />
    </button>
  );
}
