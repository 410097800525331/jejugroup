import { useState, useMemo } from "react";
import { Plane, Home as HomeIcon, Car, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

// 데이터 및 타입 임포트
import { NOTICES, ALL_FAQS, CONTACTS, getServiceLabel } from "@/data/serviceCenterData";
import { ServiceType } from "@/types/service-center";

// 추출한 원자적 컴포넌트 임포트
import SearchBar from "@/components/serviceCenter/SearchBar";
import Hero from "@/components/serviceCenter/Hero";
import SectionHeader from "@/components/serviceCenter/SectionHeader";
import ServiceCard from "@/components/serviceCenter/ServiceCard";
import NoticeCard from "@/components/serviceCenter/NoticeCard";
import FAQItem from "@/components/serviceCenter/FAQItem";
import ServiceCenterFooter from "@/components/serviceCenter/ServiceCenterFooter";
import { Button } from "@/components/ui/button";
import ContactCard from "@/components/serviceCenter/ContactCard";

/**
 * 제주항공 통합 고객센터 - 메인 페이지 (리팩토링 완료)
 * 'Zero Monolith' 원칙에 따라 모든 섹션을 원자적 컴포넌트로 분리
 * 프리미엄 디자인 및 고해상도 인터랙션 적용
 */
export default function Home() {
  const [activeService, setActiveService] = useState<ServiceType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // 챗봇 핸들러
  const handleChatbotClick = () => {
    // 챗봇 연동 로직 (추후 구현)
    alert("제주 그룹 스마트 챗봇 가동 중입니다. 잠시만 기다려 주세요!");
  };

  // FAQ 아코디언 토글 핸들러
  const handleFaqToggle = (id: string) => {
    setExpandedFaqId(prev => prev === id ? null : id);
  };

  // 공지사항 필터링 (서비스별)
  const filteredNotices = useMemo(() => {
    let result = activeService === "all" 
      ? NOTICES 
      : NOTICES.filter((n) => n.service === activeService);
    
    if (searchQuery) {
      result = result.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [activeService, searchQuery]);

  // FAQ 필터링 (검색어 및 서비스별)
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
    return result.slice(0, 4); // 메인에는 4개만 노출
  }, [activeService, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-orange-100 selection:text-orange-600 relative">
      {/* 백그라운드 데코 */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 -z-10" />
      
      {/* 1. 검색 및 상단 네비게이션 */}
      <SearchBar 
        query={searchQuery} 
        setQuery={setSearchQuery} 
        onChatbotClick={handleChatbotClick} 
      />

      {/* 2. 비주얼 히어로 섹션 */}
      <Hero />

      {/* 3. 서비스 포트폴리오 섹션 */}
      <section className="py-32 px-4 bg-gradient-to-b from-white to-gray-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            centered 
            title="세 가지 서비스, 하나의 완벽한 여행" 
            description="제주 여행의 모든 단계를 함께하는 제주 그룹의 프리미엄 통합 솔루션"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            <ServiceCard 
              title="제주항공"
              description="합리적인 가격과 안전한 운항으로 당신의 제주 여행을 더 가깝게 만듭니다."
              icon={Plane}
              color="from-orange-400 to-orange-600"
              onClick={() => setActiveService("jeju-air")}
            />
            <ServiceCard 
              title="제주스테이"
              description="제주의 매력을 가득 담은 감성 숙소부터 럭셔리 호텔까지 완벽한 휴식을 선사합니다."
              icon={HomeIcon}
              color="from-cyan-400 to-cyan-600"
              onClick={() => setActiveService("jeju-stay")}
            />
            <ServiceCard 
              title="제주렌터카"
              description="제주의 모든 도로를 자유롭게 누빌 수 있도록 다양한 차종과 신뢰받는 차량을 제공합니다."
              icon={Car}
              color="from-emerald-400 to-emerald-600"
              onClick={() => setActiveService("jeju-rental")}
            />
          </div>
        </div>
      </section>

      {/* 4. 최신 공지사항 섹션 */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="새로운 소식" 
            description="Jeju Group의 신규 서비스와 특별한 노선 정보를 가장 빠르게 만나보세요"
            action={
              <Link href="/notices">
                <a className="group flex items-center gap-2 text-orange-600 font-black text-lg hover:gap-4 transition-all">
                  전체 공지사항 보기
                  <ChevronRight size={24} />
                </a>
              </Link>
            }
          />

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

          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredNotices.map((notice) => (
                <motion.div
                  key={notice.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <NoticeCard {...notice} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {filteredNotices.length === 0 && (
            <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-black text-xl italic uppercase tracking-widest">
                No matching results found for your search
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 5. 자주 묻는 질문 (FAQ) 섹션 */}
      <section className="py-32 px-4 bg-gray-50/80 backdrop-blur-sm border-y border-gray-100/50">
        <div className="max-w-5xl mx-auto">
          <SectionHeader 
            centered
            title="궁금하신 점이 있나요?" 
            description="검색을 통해 원하시는 답변을 빠르게 찾으실 수 있습니다"
            action={
              <Link href="/faqs">
                <Button className="mt-6 bg-gray-900 hover:bg-black text-white px-10 py-7 rounded-2xl text-lg font-black transition-all shadow-xl shadow-gray-900/10">
                  전체 FAQ 라이브러리 이동
                </Button>
              </Link>
            }
          />

          <div className="space-y-6 mt-12">
            <AnimatePresence mode="popLayout">
              {filteredFaqs.map((faq) => (
                <FAQItem 
                  key={faq.id} 
                  {...faq} 
                  isExpanded={expandedFaqId === `faq-${faq.id}`}
                  onToggle={handleFaqToggle}
                />
              ))}
            </AnimatePresence>
            
            {filteredFaqs.length === 0 && (
              <div className="py-20 text-center text-gray-300 font-medium">
                검색 결과와 일치하는 자주 묻는 질문이 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. 다이렉트 컨택트 섹션 */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-white -z-10" />
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            centered
            title="실시간 도움이 필요하신가요?" 
            description="각 서비스별 전용 고객센터를 통해 전문가의 상담을 직접 받으실 수 있습니다"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 text-left">
            {CONTACTS.map((contact) => (
              <ContactCard key={contact.name} {...contact} />
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link href="/inquiries/write">
              <a className="inline-flex items-center gap-4 bg-white hover:bg-orange-50 text-orange-600 border-2 border-orange-100 hover:border-orange-500 px-12 py-5 rounded-3xl font-black text-xl transition-all shadow-xl hover:shadow-orange-500/20 group">
                상담원과 1:1 문의하기
                <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. 하단 안내 문구 */}
      <ServiceCenterFooter />
    </div>
  );
}
