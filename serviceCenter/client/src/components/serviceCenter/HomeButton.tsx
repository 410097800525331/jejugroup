import { Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface HomeButtonProps {
  href?: string;
}

/**
 * 모던 미니멀리즘 스타일의 플로팅 홈 버튼
 * 고해상도 글래스모피즘 및 마이크로 인터랙션 적용
 */
export default function HomeButton({ href = "/" }: HomeButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-10 right-10 z-50"
    >
      <a 
        href={href}
        className="group relative flex items-center justify-center w-16 h-16 bg-white/40 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl shadow-black/10 hover:shadow-orange-500/20 transition-all duration-500 overflow-hidden"
      >
        {/* 호버 시 나타나는 배경 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* 아이콘 전환 애니메이션 */}
        <div className="relative">
          <Home 
            className="text-gray-900 group-hover:scale-0 transition-transform duration-300 transform-gpu" 
            size={24} 
            strokeWidth={2.5}
          />
          <ArrowLeft 
            className="absolute inset-0 text-orange-600 scale-0 group-hover:scale-100 transition-transform duration-300 transform-gpu" 
            size={24} 
            strokeWidth={3}
          />
        </div>
        
        {/* 툴팁 효과 (이제 왼쪽으로 나타남) */}
        <div className="absolute right-20 bg-gray-900 text-white text-[10px] font-black tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap uppercase">
          Return to Main Site
        </div>
      </a>
    </motion.div>
  );
}
