import React, { useState, useEffect } from 'react';

// ============================================================================
// [기본 타입 정의 - 불변성 강제]
// ============================================================================
interface TripItem {
  id: string;
  type: 'FLIGHT' | 'HOTEL' | 'RENTAL';
  title: string;
  date: string;
  status: 'UPCOMING' | 'COMPLETED';
  desc: string;
}

// ----------------------------------------------------------------------------
// [목업 데이터 - 상태 불변성 유지를 위해 ReadonlyArray 사용]
// ----------------------------------------------------------------------------
const MOCK_ITINERARY: ReadonlyArray<TripItem> = [
  { id: 't1', type: 'FLIGHT', title: '제주항공 7C 123', date: '2026-04-01 14:00', status: 'UPCOMING', desc: '김포(GMP) ➔ 제주(CJU)' },
  { id: 't2', type: 'RENTAL', title: '제주렌트카 아이오닉 6', date: '2026-04-01 15:30', status: 'UPCOMING', desc: '완전자차 보증 / 전동화 블루' },
  { id: 't3', type: 'HOTEL', title: '제주스테이 시그니처 오션뷰', date: '2026-04-01 16:30', status: 'UPCOMING', desc: 'Check-in (2박 3일)' },
];

export default function MyPageMetaDashboard() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PASS' | 'ECO'>('OVERVIEW');
  const [points, setPoints] = useState<number>(125400);

  // 렌더링 후 마이크로 애니메이션 트리거용 상태
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --------------------------------------------------------------------------
  // [컴포넌트 분할 - 단일 책임 원칙 (Zero Monolith)]
  // --------------------------------------------------------------------------

  // 1. 통합 여정 타임라인 (Unified Itinerary Timeline)
  const renderTimeline = () => (
    <div className="relative border-l border-white/20 ml-4 space-y-8 pb-8">
      {MOCK_ITINERARY.map((item, index) => (
        <div 
          key={item.id} 
          className={`relative pl-8 transition-all duration-700 ease-in-out transform ${
            mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}
          style={{ transitionDelay: `${index * 150}ms` }}
        >
          {/* 타임라인 노드 표식 */}
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-[1.02] transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase bg-cyan-400/10 px-3 py-1 rounded-full">
                {item.type}
              </span>
              <span className="text-sm text-gray-400 font-medium">{item.date}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
              {item.title}
            </h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // 2. 스마트 패스 (Digital Wallet)
  const renderSmartPass = () => (
    <div className={`transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="w-full bg-gradient-to-br from-indigo-600/40 to-purple-800/40 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/30 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <span className="text-3xl">✈️</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">NFC 스마트 패스</h2>
          <p className="text-gray-300 mb-8 max-w-sm">
            항공 탑승권, 호텔 룸키, 렌터카 스마트키가 하나로 통합되었습니다. 휴대폰을 단말기에 탭하세요.
          </p>
          {/* 바코드 목업 (CSS 패턴) */}
          <div className="w-full h-24 bg-white/90 rounded-xl flex flex-col items-center justify-center p-4">
             <div className="flex gap-1 h-3/4 w-full justify-center">
               <div className="w-1 bg-black h-full"></div>
               <div className="w-3 bg-black h-full"></div>
               <div className="w-1 bg-black h-full"></div>
               <div className="w-2 bg-black h-full"></div>
               <div className="w-1 bg-black h-full"></div>
               <div className="w-4 bg-black h-full"></div>
               <div className="w-2 bg-black h-full"></div>
               <div className="w-1 bg-black h-full"></div>
               <div className="w-3 bg-black h-full"></div>
               <div className="w-1 bg-black h-full"></div>
             </div>
             <p className="text-black font-mono text-xs mt-2 tracking-widest">7C-JG-2026-04</p>
          </div>
        </div>
      </div>
    </div>
  );

  // 3. 멤버십 포인트 구간 (Point & Level)
  const renderPointDashboard = () => (
    <div className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-700 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-gray-400 font-medium mb-1">통합 멤버십</p>
          <div className="flex items-baseline gap-2">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
              {points.toLocaleString()}
            </h1>
            <span className="text-xl text-cyan-500 font-bold">P</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400 mb-1">다음 등급 (VIP) 까지</p>
          <p className="text-lg text-white font-bold">24,600 P</p>
        </div>
      </div>
      
      {/* 3D 슬라이더 프로그레스 바 흉내 */}
      <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden border border-white/10 relative">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: '83%' }}
        />
        {/* 빛 번짐 효과 */}
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
    </div>
  );

  // 4. 컨텍스트 기반 AI 큐레이션 (Zero State AI)
  const renderCuration = () => (
    <div className={`mt-8 bg-gradient-to-r from-slate-800/50 to-emerald-900/30 border border-emerald-500/20 backdrop-blur-md rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
          ✨
        </div>
        <div>
          <h4 className="text-lg font-bold text-white mb-1">AI 맞춤 큐레이션</h4>
          <p className="text-sm text-gray-300">
            항공권과 숙박 예약이 완료되었습니다. 전기차 렌트 시 <span className="text-emerald-400 font-bold">추가 5% 할인</span> 과 에코 배지를 드립니다.
          </p>
        </div>
      </div>
      <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-full transition-all whitespace-nowrap shadow-[0_0_15px_rgba(16,185,129,0.4)]">
        차량 예약하기
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans selection:bg-cyan-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* 헤더 섹션 */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className={`transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}>
            <p className="text-cyan-400 font-semibold tracking-widest text-sm mb-2 uppercase">Jeju Group Meta Hub</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-lg">
              마이페이지 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">통합 대시보드</span>
            </h1>
          </div>
          <div className={`flex gap-3 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md transition-all duration-700 delay-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            {['OVERVIEW', 'PASS', 'ECO'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-white text-black shadow-lg scale-105' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* 메인 레이아웃 (CSS Grid 기반 Bento-box) */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 좌측 패널 (통합 타임라인) */}
          <section className="lg:col-span-7">
            <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
              나의 통합 여정
              <span className="bg-white/10 text-xs py-1 px-3 rounded-full border border-white/10 backdrop-blur-sm">Upcoming</span>
            </h2>
            {renderTimeline()}
            {renderCuration()}
          </section>

          {/* 우측 패널 (포인트 및 스마트패스) */}
          <section className="lg:col-span-5 flex flex-col gap-8">
            {renderPointDashboard()}
            {renderSmartPass()}
          </section>
          
        </main>
      </div>

      {/* 글로벌 스타일/애니메이션 정의 (필요시) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
