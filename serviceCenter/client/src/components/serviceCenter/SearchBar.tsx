import { Search, MessageCircle } from "lucide-react";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onChatbotClick: () => void;
}

/**
 * 고객센터 전용 검색바 컴포넌트
 * 글래스모피즘 스타일 적용으로 세련된 UX 제공
 */
export default function SearchBar({ query, setQuery, onChatbotClick }: SearchBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="도움이 필요하신 내용을 검색해 보세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
        <button
          onClick={onChatbotClick}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl transition-all font-bold shadow-md shadow-orange-500/20 hover:shadow-lg hover:-translate-y-0.5"
          title="챗봇 열기"
        >
          <MessageCircle size={18} />
          <span className="hidden sm:inline text-sm">팻봇</span>
        </button>
      </div>
    </div>
  );
}
