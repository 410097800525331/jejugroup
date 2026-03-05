import { useState } from "react";
import { Post, ServiceType, SERVICES } from "@/types/board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface WritePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function WritePostModal({ isOpen, onClose, onSubmit }: WritePostModalProps) {
  const [service, setService] = useState<ServiceType>('flight');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reservationId, setReservationId] = useState('');

  const currentService = SERVICES[service];
  const categories = currentService.categories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim() || !email.trim() || !phone.trim()) {
      alert('모든 필수 항목을 입력해주세요');
      return;
    }

    onSubmit({
      service,
      title,
      content,
      author,
      email,
      phone,
      reservationId: reservationId || undefined,
      category: category || '일반',
      status: 'pending'
    });

    // 폼 초기화
    setTitle('');
    setContent('');
    setAuthor('');
    setEmail('');
    setPhone('');
    setReservationId('');
    setCategory('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">새 문의 작성</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Service Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              서비스 선택 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {Object.values(SERVICES).map((svc) => (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => {
                    setService(svc.id);
                    setCategory('');
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    service === svc.id
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{
                    borderColor: service === svc.id ? svc.color : undefined,
                    backgroundColor: service === svc.id ? `${svc.color}15` : undefined
                  }}
                >
                  <div className="font-semibold text-sm text-slate-900">{svc.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              문의 분류 <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">선택해주세요</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문의 제목을 입력하세요"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="상세한 문의 내용을 입력해주세요"
              rows={6}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          {/* Reservation ID */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              예약 번호
            </label>
            <Input
              type="text"
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
              placeholder="예약 번호 (선택사항)"
            />
          </div>

          {/* Author Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="성명"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                연락처 <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              이메일 <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              문의 제출
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              취소
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
