import { useState, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

// 데이터 및 타입 임포트
import { ALL_FAQS, getServiceLabel } from "@/data/serviceCenterData";
import { ServiceType } from "@/types/service-center";

// 공통 컴포넌트 임포트
import SearchBar from "@/components/serviceCenter/SearchBar";
import SectionHeader from "@/components/serviceCenter/SectionHeader";
import FAQItem from "@/components/serviceCenter/FAQItem";
import ServiceCenterFooter from "@/components/serviceCenter/ServiceCenterFooter";

/**
 * FAQ 전용 라이브러리 페이지 (리팩토링 완료)
 * 전체 FAQ 데이터를 필터링하고 검색할 수 있는 인터페이스 제공
 */
export default function FAQs() {
  const [activeService, setActiveService] = useState<ServiceType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // 챗봇 핸들러
  const handleChatbotClick = () => {
    alert("제주 그룹 스마트 챗봇이 상담 대기 중입니다!");
  };

  // FAQ 아코디언 토글 핸들러
  const handleFaqToggle = (id: string) => {
    setExpandedFaqId(prev => prev === id ? null : id);
  };

  // 서비스별 카테고리 추출
  const categories = useMemo(() => {
    const categoriesSet = new Set<string>();
    const filteredByService = activeService === "all" 
      ? ALL_FAQS 
      : ALL_FAQS.filter(f => f.service === activeService);
    
    filteredByService.forEach(f => categoriesSet.add(f.category));
    return Array.from(categoriesSet);
  }, [activeService]);

  // 최종 필터링된 FAQ 데이터
  const filteredFaqs = useMemo(() => {
    let result = activeService === "all" 
      ? ALL_FAQS 
      : ALL_FAQS.filter((f) => f.service === activeService);

    if (searchQuery) {
      result = result.filter(f => 
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [activeService, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      {/* 검색바 */}
      <SearchBar 
        query={searchQuery} 
        setQuery={setSearchQuery} 
        onChatbotClick={handleChatbotClick} 
      />

      <main className="py-24 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          {/* 뒤로가기 및 헤더 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-16"
          >
            <Link href="/">
              <a className="inline-flex items-center gap-3 text-orange-600 hover:text-orange-700 font-black text-lg mb-10 group bg-orange-50 px-6 py-3 rounded-2xl transition-all hover:gap-6 shadow-sm">
                <ChevronLeft size={24} />
                메인 고객센터로 돌아가기
              </a>
            </Link>
            
            <SectionHeader 
              title="JEJU GROUP FAQ LIBRARY" 
              description="75개 이상의 정제된 데이터를 통해 궁금하신 점을 즉시 해결해 드립니다."
            />
          </motion.div>

          {/* 서비스 필터 탭 */}
          <div className="flex gap-4 mb-16 overflow-x-auto pb-4 no-scrollbar">
            {["all", "jeju-air", "jeju-stay", "jeju-rental"].map((service) => (
              <button
                key={service}
                onClick={() => setActiveService(service as ServiceType | "all")}
                className={`flex-shrink-0 px-8 py-3 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-md ${
                  activeService === service
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange-500/20 scale-105"
                    : "bg-white text-gray-400 hover:text-gray-900 border border-gray-100 hover:border-gray-200"
                }`}
              >
                {service === "all" ? "EXPLORE ALL" : getServiceLabel(service).toUpperCase()}
              </button>
            ))}
          </div>

          {/* FAQ 리스트 (카테고리별 그룹화 또는 전체 리스트) */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <FAQItem 
                    key={faq.id} 
                    {...faq} 
                    isExpanded={expandedFaqId === `faq-${faq.id}`}
                    onToggle={handleFaqToggle}
                  />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-32 text-center"
                >
                  <p className="text-gray-300 font-black text-2xl italic tracking-widest uppercase">
                    NO MATCHING FAQ FOUND FOR YOUR QUERY
                  </p>
                  <button 
                    onClick={() => {setSearchQuery(""); setActiveService("all");}}
                    className="mt-8 text-orange-500 font-bold hover:underline"
                  >
                    필터 및 검색 초기화
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* 하단 안내 문구 */}
      <ServiceCenterFooter />
    </div>
  );
}
