import { ChevronLeft } from "lucide-react";
import { startTransition, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";

import InquiryForm from "@/components/serviceCenter/InquiryForm";
import InquiryList from "@/components/serviceCenter/InquiryList";
import SearchBar from "@/components/serviceCenter/SearchBar";
import ServiceCenterFooter from "@/components/serviceCenter/ServiceCenterFooter";
import { createInquiry, fetchInquiries } from "@/lib/inquiryApi";
import type { InquiryRecord, InquirySubmission } from "@/types/service-center";
import "@/styles/bbs.css";

const PAGE_SIZE = 4;

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message.trim() ? error.message : fallback;

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"list" | "write">("list");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const handleChatbotClick = () => {
    alert("제주 그룹 스마트 챗봇이 준비 중입니다. 잠시만 기다려 주세요.");
  };

  const loadInquiries = async (signal?: AbortSignal) => {
    if (!signal?.aborted) {
      setIsLoading(true);
      setLoadError("");
    }

    try {
      const nextInquiries = await fetchInquiries(signal);
      if (signal?.aborted) {
        return;
      }

      startTransition(() => {
        setInquiries(nextInquiries);
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      if (!signal?.aborted) {
        setLoadError(getErrorMessage(error, "문의 목록을 불러오지 못했습니다."));
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadInquiries(controller.signal);

    return () => controller.abort();
  }, []);

  const filteredInquiries = useMemo(() => {
    if (!searchQuery) {
      return inquiries;
    }

    const normalizedQuery = searchQuery.toLowerCase();
    return inquiries.filter(
      (inquiry) =>
        inquiry.title.toLowerCase().includes(normalizedQuery) ||
        inquiry.content.toLowerCase().includes(normalizedQuery) ||
        inquiry.service.toLowerCase().includes(normalizedQuery) ||
        inquiry.status.toLowerCase().includes(normalizedQuery),
    );
  }, [inquiries, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / PAGE_SIZE));
  const pagedInquiries = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredInquiries.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredInquiries]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, view]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleInquirySubmitted = async (inquiry: InquirySubmission) => {
    await createInquiry(inquiry);
    setSearchQuery("");
    setCurrentPage(1);
    setView("list");
    await loadInquiries();
  };

  const renderListContent = () => {
    if (isLoading) {
      return (
        <div className="bbs-container">
          <p style={{ color: "#64748b", fontWeight: 600 }}>문의 목록을 불러오는 중입니다...</p>
        </div>
      );
    }

    if (loadError && inquiries.length === 0) {
      return (
        <div className="bbs-container">
          <p style={{ color: "#dc2626", fontWeight: 700, marginBottom: "12px" }}>{loadError}</p>
          <button
            type="button"
            className="bbs-write-btn"
            onClick={() => {
              void loadInquiries();
            }}
          >
            다시 불러오기
          </button>
        </div>
      );
    }

    return (
      <>
        {loadError ? (
          <p style={{ color: "#dc2626", fontWeight: 700, marginBottom: "16px" }}>{loadError}</p>
        ) : null}
        <InquiryList
          currentPage={currentPage}
          inquiries={pagedInquiries}
          onPageChange={setCurrentPage}
          onWriteClick={() => setView("write")}
          totalPages={totalPages}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <SearchBar query={searchQuery} setQuery={setSearchQuery} onChatbotClick={handleChatbotClick} />

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8 text-gray-400 font-bold">
            <Link href="/">
              <a className="flex items-center gap-1.5 hover:text-orange-500 transition-colors">
                <ChevronLeft size={18} />
                <span>메인 고객센터</span>
              </a>
            </Link>
            {view === "write" ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-200 select-none">/</span>
                <button
                  onClick={() => setView("list")}
                  className="hover:text-orange-500 transition-colors flex items-center p-0"
                  style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
                >
                  목록으로 돌아가기
                </button>
              </div>
            ) : null}
          </div>

          {view === "list" ? renderListContent() : (
            <div className="bbs-container">
              <InquiryForm onSubmitted={handleInquirySubmitted} />
            </div>
          )}
        </div>
      </main>

      <ServiceCenterFooter />
    </div>
  );
}
