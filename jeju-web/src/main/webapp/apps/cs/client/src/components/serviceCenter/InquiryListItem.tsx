import { ChevronRight } from "lucide-react";

import { getServiceLabel } from "@/data/serviceCenterData";
import type { InquiryStatus, ServiceType } from "@/types/service-center";
import "@/styles/bbs.css";

const COMPLETED_STATUS_KEYWORDS = ["answered", "resolved", "closed", "completed", "done", "complete", "close"];

interface InquiryListItemProps {
  id: number;
  title: string;
  date: string;
  status: InquiryStatus;
  service: ServiceType;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function InquiryListItem({ title, date, status, service, onClick, isSelected = false }: InquiryListItemProps) {
  const isCompletedStatus = COMPLETED_STATUS_KEYWORDS.some((keyword) => status.toLowerCase().includes(keyword));

  return (
    <button
      type="button"
      className="bbs-item"
      onClick={onClick}
      aria-pressed={isSelected}
      style={{
        width: "100%",
        textAlign: "left",
        background: isSelected ? "#fff7ed" : "none",
        border: "none",
        padding: "24px 0",
        color: "inherit",
        font: "inherit",
      }}
    >
      <div className="bbs-item-content">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 800,
              color: "#ff6000",
              padding: "2px 8px",
              background: "#fff3eb",
              borderRadius: "4px",
            }}
          >
            {getServiceLabel(service)}
          </span>
          <span className="bbs-item-title">{title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className="bbs-item-date">{date}</span>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: isCompletedStatus ? "#10b981" : "#94a3b8",
            }}
          >
            {isCompletedStatus ? "답변완료" : "답변대기"}
          </span>
        </div>
      </div>
      <ChevronRight size={20} className="bbs-item-chevron" />
    </button>
  );
}
