import { ChevronLeft } from "lucide-react";
import { startTransition, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";

import InquiryDetail from "@/components/serviceCenter/InquiryDetail";
import InquiryForm from "@/components/serviceCenter/InquiryForm";
import InquiryList from "@/components/serviceCenter/InquiryList";
import SearchBar from "@/components/serviceCenter/SearchBar";
import ServiceCenterFooter from "@/components/serviceCenter/ServiceCenterFooter";
import { createInquiry, deleteInquiry, fetchInquiries, updateInquiry } from "@/lib/inquiryApi";
import type { InquiryRecord, InquirySubmission, ServiceType } from "@/types/service-center";
import "@/styles/bbs.css";

const PAGE_SIZE = 4;

type InquiryPageView = "list" | "write" | "detail" | "edit";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message.trim() ? error.message : fallback;

interface InquiriesProps {
  mode?: "list" | "write";
}

export default function Inquiries({ mode = "list" }: InquiriesProps) {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeServiceFilter, setActiveServiceFilter] = useState<"all" | ServiceType>("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);
  const [view, setView] = useState<InquiryPageView>(mode === "write" ? "write" : "list");
  const [, setLocation] = useLocation();

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

  useEffect(() => {
    if (mode === "write") {
      setView("write");
      setSelectedInquiryId(null);
      return;
    }

    setView((currentView) => (currentView === "write" ? "list" : currentView));
  }, [mode]);

  const openListView = () => {
    setLocation("/inquiries");
    setSelectedInquiryId(null);
    setView("list");
  };

  const openWriteView = () => {
    setLocation("/inquiries/write");
    setSelectedInquiryId(null);
    setView("write");
  };

  const selectedInquiry = useMemo(
    () => inquiries.find((inquiry) => inquiry.id === selectedInquiryId) ?? null,
    [inquiries, selectedInquiryId],
  );

  useEffect(() => {
    if ((view === "detail" || view === "edit") && !selectedInquiry) {
      setView("list");
      setSelectedInquiryId(null);
    }
  }, [selectedInquiry, view]);

  const filteredInquiries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return inquiries.filter((inquiry) => {
      if (activeServiceFilter !== "all" && inquiry.service !== activeServiceFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        inquiry.title.toLowerCase().includes(normalizedQuery) ||
        inquiry.content.toLowerCase().includes(normalizedQuery) ||
        inquiry.service.toLowerCase().includes(normalizedQuery) ||
        inquiry.status.toLowerCase().includes(normalizedQuery) ||
        inquiry.date.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [activeServiceFilter, inquiries, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / PAGE_SIZE));
  const pagedInquiries = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredInquiries.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredInquiries]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeServiceFilter, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleInquirySubmitted = async (inquiry: InquirySubmission) => {
    await createInquiry(inquiry);
    setSearchQuery("");
    setActiveServiceFilter("all");
    setCurrentPage(1);
    await loadInquiries();
    openListView();
  };

  const handleInquiryUpdated = async (inquiry: InquirySubmission) => {
    if (!selectedInquiry) {
      return;
    }

    const updatedInquiry = await updateInquiry({
      ...selectedInquiry,
      ...inquiry,
    });

    await loadInquiries();
    setSelectedInquiryId(updatedInquiry.id);
    setView("detail");
    setLocation("/inquiries");
  };

  const handleInquiryDelete = async () => {
    if (!selectedInquiry) {
      return;
    }

    if (!confirm(`"${selectedInquiry.title}" 문의를 삭제하시겠습니까?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteInquiry(selectedInquiry.id);
      alert("문의가 삭제되었습니다.");
      await loadInquiries();
      openListView();
    } catch (error) {
      alert(getErrorMessage(error, "문의 삭제에 실패했습니다."));
    } finally {
      setIsDeleting(false);
    }
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
          activeServiceFilter={activeServiceFilter}
          currentPage={currentPage}
          inquiries={pagedInquiries}
          onInquirySelect={(inquiry) => {
            setSelectedInquiryId(inquiry.id);
            setView("detail");
            setLocation("/inquiries");
          }}
          onPageChange={setCurrentPage}
          onServiceFilterChange={setActiveServiceFilter}
          onWriteClick={openWriteView}
          totalPages={totalPages}
        />
      </>
    );
  };

  const renderActiveContent = () => {
    if (view === "write") {
      return (
        <div className="bbs-container">
          <InquiryForm onSubmitted={handleInquirySubmitted} />
        </div>
      );
    }

    if (view === "detail" && selectedInquiry) {
      return (
        <InquiryDetail
          inquiry={selectedInquiry}
          isDeleting={isDeleting}
          onBack={openListView}
          onDelete={() => {
            void handleInquiryDelete();
          }}
          onEdit={() => setView("edit")}
        />
      );
    }

    if (view === "edit" && selectedInquiry) {
      return (
        <div className="bbs-container">
          <InquiryForm
            description="등록된 문의를 수정한 뒤 저장할 수 있습니다."
            initialValues={selectedInquiry}
            onCancel={() => setView("detail")}
            onSubmitted={handleInquiryUpdated}
            submitLabel="문의 수정 저장하기"
            title="문의 수정"
          />
        </div>
      );
    }

    return renderListContent();
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
            {view !== "list" ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-200 select-none">/</span>
                <button
                  onClick={openListView}
                  className="hover:text-orange-500 transition-colors flex items-center p-0"
                  style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
                >
                  목록으로 돌아가기
                </button>
              </div>
            ) : null}
          </div>

          {renderActiveContent()}
        </div>
      </main>

      <ServiceCenterFooter />
    </div>
  );
}
