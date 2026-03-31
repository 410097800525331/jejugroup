import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Plus } from "lucide-react";

import type { InquiryRecord } from "@/types/service-center";
import "@/styles/bbs.css";
import InquiryListItem from "./InquiryListItem";

interface InquiryListProps {
  inquiries: InquiryRecord[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onWriteClick: () => void;
  onInquirySelect: (inquiry: InquiryRecord) => void;
  authenticated: boolean;
  selectedInquiryId?: number | null;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export default function InquiryList({
  inquiries,
  currentPage,
  totalPages,
  onPageChange,
  onWriteClick,
  onInquirySelect,
  authenticated,
  selectedInquiryId = null,
  isLoading = false,
  errorMessage = null,
}: InquiryListProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const writeButtonDisabled = !authenticated || isLoading;

  return (
    <div className="bbs-container">
      <header className="bbs-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1>내 문의 내역</h1>
          <p>로그인한 계정으로 작성한 1:1 문의 내역입니다.</p>
          {!authenticated ? (
            <div
              style={{
                marginTop: "12px",
                padding: "12px 14px",
                borderRadius: "12px",
                background: "#fff3eb",
                color: "#c2410c",
                fontSize: "0.92rem",
                fontWeight: 700,
              }}
            >
              로그인해야 문의 목록 확인과 작성이 가능합니다.
            </div>
          ) : null}
          {errorMessage ? (
            <div
              style={{
                marginTop: "12px",
                padding: "12px 14px",
                borderRadius: "12px",
                background: "#fef2f2",
                color: "#b91c1c",
                fontSize: "0.92rem",
                fontWeight: 700,
              }}
            >
              {errorMessage}
            </div>
          ) : null}
        </div>
        <button
          className="bbs-write-btn"
          onClick={onWriteClick}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
          disabled={writeButtonDisabled}
          type="button"
        >
          <Plus size={20} />
          {authenticated ? "문의하기" : "로그인이 필요합니다"}
        </button>
      </header>

      {authenticated ? (
        <>
          <div className="bbs-list">
            {isLoading ? (
              <div className="py-20 text-center text-gray-400">문의 내역을 불러오는 중입니다.</div>
            ) : inquiries.length > 0 ? (
              inquiries.map((inquiry, index) => (
                <InquiryListItem
                  key={inquiry.id}
                  id={typeof inquiry.id === "number" ? inquiry.id : Number(inquiry.id) || index + 1}
                  title={inquiry.title}
                  date={inquiry.date}
                  status={inquiry.status}
                  service={inquiry.service}
                  onClick={() => onInquirySelect(inquiry)}
                  isSelected={selectedInquiryId === inquiry.id}
                />
              ))
            ) : (
              <div className="py-20 text-center text-gray-400">등록된 문의 내역이 없습니다.</div>
            )}
          </div>

          {totalPages > 1 ? (
            <div className="bbs-pagination">
              <button className="bbs-page-btn" disabled={currentPage === 1} onClick={() => onPageChange(1)} type="button">
                <ChevronsLeft size={18} className="bbs-page-arrow" />
              </button>
              <button
                className="bbs-page-btn"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                type="button"
              >
                <ChevronLeft size={18} className="bbs-page-arrow" />
              </button>

              {pages.map((page) => (
                <button
                  key={page}
                  className={`bbs-page-btn ${page === currentPage ? "active" : ""}`}
                  onClick={() => onPageChange(page)}
                  type="button"
                >
                  {page}
                </button>
              ))}

              <button
                className="bbs-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                type="button"
              >
                <ChevronRight size={18} className="bbs-page-arrow" />
              </button>
              <button
                className="bbs-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
                type="button"
              >
                <ChevronsRight size={18} className="bbs-page-arrow" />
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="bbs-list">
          <div className="py-20 text-center text-gray-400">로그인해야 문의 목록을 확인할 수 있습니다.</div>
        </div>
      )}
    </div>
  );
}
