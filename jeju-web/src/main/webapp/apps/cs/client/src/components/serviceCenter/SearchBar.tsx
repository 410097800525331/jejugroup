import { MessageCircle, Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onChatbotClick: () => void;
}

export default function SearchBar({ query, setQuery, onChatbotClick }: SearchBarProps) {
  return (
    <div className="sticky inset-x-0 top-0 z-50 border-b border-orange-100/70 bg-white/88 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/72">
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center gap-4">
        <div className="flex-1 relative group">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="필요하신 내용을 검색해 보세요"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
        <button
          onClick={onChatbotClick}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl transition-all font-bold shadow-md shadow-orange-500/20 hover:shadow-lg hover:-translate-y-0.5"
          title="챗봇 열기"
        >
          <MessageCircle size={18} />
          <span className="hidden sm:inline text-sm">챗봇</span>
        </button>
      </div>
    </div>
  );
}
