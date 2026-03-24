import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, PencilLine, Trash2, type LucideIcon } from "lucide-react";
import { Link } from "wouter";

import type { ServiceType } from "@/types/service-center";

const SERVICE_LABELS: Record<ServiceType, string> = {
  "jeju-air": "제주항공",
  "jeju-stay": "제주스테이",
  "jeju-rental": "제주렌터카",
  common: "공통",
};

type AdminFaqPayload = {
  id: number;
  service: ServiceType;
  question: string;
  answer: string;
  category: string;
  active: boolean;
  color?: string;
  icon?: LucideIcon;
  sortOrder?: number;
};

interface FAQItemProps {
  id: number;
  question: string;
  answer: string;
  category: string;
  service: ServiceType;
  sortOrder?: number;
  color?: string;
  icon?: LucideIcon;
  active?: boolean | null;
  isExpanded: boolean;
  isAdmin?: boolean;
  onToggle: (id: string) => void;
  onEdit?: (faq: AdminFaqPayload) => void;
  onDelete?: (faq: AdminFaqPayload) => void;
}

export default function FAQItem({
  id,
  question,
  answer,
  category,
  service,
  sortOrder,
  color = "from-orange-400 to-orange-600",
  icon: Icon = HelpCircle,
  active,
  isExpanded,
  isAdmin = false,
  onToggle,
  onEdit,
  onDelete,
}: FAQItemProps) {
  const itemId = `faq-${id}`;
  const isInactive = active === false;
  const adminPayload: AdminFaqPayload = {
    id,
    service,
    question,
    answer,
    category,
    active: active !== false,
    color,
    icon: Icon,
    sortOrder: sortOrder ?? 0,
  };

  return (
    <motion.div
      layout
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-[2.5rem] border transition-all mb-4 ${
        isExpanded
          ? "bg-white border-orange-300 shadow-[0_30px_70px_rgba(255,100,0,0.15)] z-10 scale-[1.02]"
          : "bg-white border-gray-200/60 hover:border-gray-300 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)]"
      } ${isInactive ? "opacity-80" : ""}`}
    >
      {isAdmin ? (
        <div className="flex items-center justify-end gap-2 px-8 pt-5 md:px-10">
          <span
            className={`mr-auto rounded-full px-2.5 py-1 text-[10px] font-black tracking-widest uppercase border ${
              isInactive ? "border-gray-200 bg-gray-100 text-gray-400" : "border-orange-100 bg-orange-50 text-orange-600"
            }`}
          >
            {isInactive ? "비활성" : "활성"}
          </span>
          {onEdit ? (
            <button
              type="button"
              onClick={() => onEdit(adminPayload)}
              className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600 transition hover:border-orange-300 hover:bg-orange-100"
            >
              <PencilLine size={14} />
              수정
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(adminPayload)}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-black text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={14} />
              삭제
            </button>
          ) : null}
        </div>
      ) : null}

      <button
        onClick={() => onToggle(itemId)}
        className="w-full p-8 md:p-10 flex items-center justify-between gap-6 hover:bg-gray-50/30 transition-colors text-left focus:outline-none"
      >
        <div className="flex items-center gap-6 md:gap-8 flex-1 min-w-0">
          <div className="flex-shrink-0 relative">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 duration-500`}>
              <Icon className="text-white" size={28} />
            </div>
            {isExpanded ? (
              <motion.div
                layoutId="expanding-ring"
                className="absolute inset-0 rounded-2xl border-2 border-orange-500/30 scale-125 opacity-0 animate-pulse"
              />
            ) : null}
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-gray-200/50 bg-gray-50 text-gray-400">
                {SERVICE_LABELS[service]}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-gray-200/50 bg-gray-50 text-gray-400">
                {category}
              </span>
            </div>
            <h3 className={`text-xl md:text-2xl font-black text-gray-900 leading-tight transition-all ${isExpanded ? "text-orange-600" : "group-hover:text-gray-900"}`}>
              {question}
            </h3>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 group-hover:bg-orange-50 transition-colors">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="minus"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <Minus className="text-orange-500" size={24} strokeWidth={3} />
              </motion.div>
            ) : (
              <motion.div
                key="plus"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Plus className="text-gray-400 group-hover:text-orange-400" size={24} strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-10 pb-12 pt-4 border-t border-gray-100 mx-10">
              <div className="bg-orange-50/30 rounded-3xl p-8 border border-orange-100/50">
                <p className="text-lg text-gray-700 font-semibold leading-relaxed whitespace-pre-line">
                  {answer}
                </p>
                <div className="mt-8 flex items-center gap-4 text-sm text-gray-400 font-bold border-t border-gray-200/50 pt-6">
                  <span>추가로 궁금한 점이 있으면</span>
                  <Link href="/inquiries">
                    <a className="text-orange-600 hover:underline">문의하기</a>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
