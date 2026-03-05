import { useState } from "react";
import { Post, SERVICES } from "@/types/board";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, X, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface PostDetailProps {
  post: Post;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Omit<Post, 'id' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
}

const statusLabels = {
  pending: '대기중',
  answered: '답변됨',
  resolved: '해결됨'
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  answered: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800'
};

export default function PostDetail({ post, onClose, onUpdate, onDelete }: PostDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedStatus, setEditedStatus] = useState(post.status);

  const service = SERVICES[post.service];

  const handleSave = () => {
    onUpdate(post.id, {
      title: editedTitle,
      content: editedContent,
      status: editedStatus
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('이 게시물을 삭제하시겠습니까?')) {
      onDelete(post.id);
      onClose();
    }
  };

  return (
    <Card className="h-full flex flex-col border-2">
      {/* Header */}
      <CardHeader className="border-b border-slate-200 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-semibold px-2 py-1 rounded"
                style={{
                  backgroundColor: `${service.color}20`,
                  color: service.color
                }}
              >
                {service.name}
              </span>
              {!isEditing && (
                <Badge className={statusColors[post.status]}>
                  {statusLabels[post.status]}
                </Badge>
              )}
            </div>
            {isEditing ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="font-semibold text-lg"
              />
            ) : (
              <h3 className="font-semibold text-lg text-slate-900">{post.title}</h3>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </CardHeader>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Meta Info */}
        <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">작성자:</span>
            <span className="font-medium text-slate-900">{post.author}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">이메일:</span>
            <span className="font-medium text-slate-900 truncate">{post.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">연락처:</span>
            <span className="font-medium text-slate-900">{post.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">분류:</span>
            <span className="font-medium text-slate-900">{post.category}</span>
          </div>
          {post.reservationId && (
            <div className="flex justify-between">
              <span className="text-slate-600">예약번호:</span>
              <span className="font-medium text-slate-900">{post.reservationId}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-600">작성일:</span>
            <span className="font-medium text-slate-900">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: ko
              })}
            </span>
          </div>
          {post.updatedAt !== post.createdAt && (
            <div className="flex justify-between">
              <span className="text-slate-600">수정일:</span>
              <span className="font-medium text-slate-900">
                {formatDistanceToNow(new Date(post.updatedAt), {
                  addSuffix: true,
                  locale: ko
                })}
              </span>
            </div>
          )}
        </div>

        {/* Status Selector (Edit Mode) */}
        {isEditing && (
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              상태
            </label>
            <select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="pending">대기중</option>
              <option value="answered">답변됨</option>
              <option value="resolved">해결됨</option>
            </select>
          </div>
        )}

        {/* Content */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-2">문의 내용</h4>
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              rows={6}
            />
          ) : (
            <p className="text-slate-700 whitespace-pre-wrap text-sm">{post.content}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4 space-y-2">
        {isEditing ? (
          <>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                저장
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setEditedTitle(post.title);
                  setEditedContent(post.content);
                  setEditedStatus(post.status);
                }}
                variant="outline"
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              수정
            </Button>
            <Button
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
