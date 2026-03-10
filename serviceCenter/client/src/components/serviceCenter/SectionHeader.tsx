import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  centered?: boolean;
}

/**
 * 섹션 헤더 컴포넌트
 * 타이틀, 설명, 우측 액션 영역 포함
 */
export default function SectionHeader({ title, description, action, centered = false }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row ${centered ? 'items-center text-center' : 'items-start md:items-end justify-between'} mb-12 gap-6`}>
      <div className={centered ? 'max-w-2xl' : ''}>
        <h3 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-lg text-gray-500 font-medium">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
