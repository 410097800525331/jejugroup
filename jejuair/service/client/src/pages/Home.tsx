import { useState } from "react";
import { useBoardState } from "@/hooks/useBoardState";
import { SERVICES, ServiceType } from "@/types/board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, ChevronDown } from "lucide-react";
import WritePostModal from "@/components/WritePostModal";
import PostList from "@/components/PostList";
import PostDetail from "@/components/PostDetail";

/**
 * Design Philosophy: Board-Style Inquiry System
 * - Service-specific colors: Flight (#ff5100), Hotel (#0066cc), Rental (#ff0000)
 * - Layout: Clean board with filtering, search, and post management
 * - Features: Create, Read, Update, Delete posts with status tracking
 */

export default function Home() {
  const boardState = useBoardState();
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredPosts = boardState.getFilteredPosts();
  const selectedPost = selectedPostId ? boardState.getPost(selectedPostId) : null;

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedPostId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">제주 통합 문의 게시판</h1>
              <p className="text-sm text-slate-600 mt-1">항공편, 숙박, 렌터카 문의를 한곳에서 관리하세요</p>
            </div>
            <Button
              onClick={() => setIsWriteModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              새 문의 작성
            </Button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="제목, 내용, 작성자로 검색..."
                value={boardState.searchTerm}
                onChange={(e) => boardState.setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Service Filter */}
            <select
              value={boardState.filteredService}
              onChange={(e) => boardState.setFilteredService(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">모든 서비스</option>
              <option value="flight">항공편 문의</option>
              <option value="hotel">숙박 문의</option>
              <option value="rental">렌터카 문의</option>
            </select>

            {/* Status Filter */}
            <select
              value={boardState.filteredStatus}
              onChange={(e) => boardState.setFilteredStatus(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">모든 상태</option>
              <option value="pending">대기중</option>
              <option value="answered">답변됨</option>
              <option value="resolved">해결됨</option>
            </select>

            {/* Sort */}
            <select
              value={boardState.sortBy}
              onChange={(e) => boardState.setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="newest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {filteredPosts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-slate-600 mb-4">문의 게시물이 없습니다</p>
              <Button
                onClick={() => setIsWriteModalOpen(true)}
                variant="outline"
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                첫 번째 문의 작성하기
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Post List */}
            <div className="lg:col-span-2">
              <PostList
                posts={filteredPosts}
                onPostClick={handlePostClick}
                selectedPostId={selectedPostId}
              />
            </div>

            {/* Post Detail Sidebar */}
            <div className="lg:col-span-1">
              {selectedPost ? (
                <PostDetail
                  post={selectedPost}
                  onClose={handleCloseDetail}
                  onUpdate={boardState.updatePost}
                  onDelete={boardState.deletePost}
                />
              ) : (
                <Card className="bg-slate-50 border-2 border-dashed border-slate-300">
                  <CardContent className="pt-8 text-center">
                    <p className="text-slate-600">게시물을 선택하여</p>
                    <p className="text-slate-600">상세 정보를 확인하세요</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Write Post Modal */}
      {isWriteModalOpen && (
        <WritePostModal
          isOpen={isWriteModalOpen}
          onClose={() => setIsWriteModalOpen(false)}
          onSubmit={(data) => {
            boardState.addPost(data);
            setIsWriteModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
