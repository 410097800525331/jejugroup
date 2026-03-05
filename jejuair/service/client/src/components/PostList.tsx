import { Post, SERVICES } from "@/types/board";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface PostListProps {
  posts: Post[];
  onPostClick: (postId: string) => void;
  selectedPostId: string | null;
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

export default function PostList({ posts, onPostClick, selectedPostId }: PostListProps) {
  return (
    <div className="space-y-3">
      {posts.map((post) => {
        const service = SERVICES[post.service];
        const isSelected = selectedPostId === post.id;

        return (
          <Card
            key={post.id}
            onClick={() => onPostClick(post.id)}
            className={`cursor-pointer transition-all border-2 ${
              isSelected
                ? 'border-slate-900 bg-slate-50 shadow-md'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                {/* Left: Service Color Bar */}
                <div
                  className="w-1 h-full rounded-full flex-shrink-0"
                  style={{ backgroundColor: service.color, minHeight: '60px' }}
                />

                {/* Center: Post Info */}
                <div className="flex-1 min-w-0">
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
                    <Badge className={statusColors[post.status]}>
                      {statusLabels[post.status]}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-1 truncate">
                    {post.title}
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.category}</span>
                    </div>
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                        locale: ko
                      })}
                    </span>
                  </div>
                </div>

                {/* Right: Chevron */}
                <div className="text-slate-400 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
