import { useState, useCallback, useEffect } from 'react';
import { Post, ServiceType } from '@/types/board';
import { nanoid } from 'nanoid';

export function useBoardState() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredService, setFilteredService] = useState<ServiceType | 'all'>('all');
  const [filteredStatus, setFilteredStatus] = useState<'all' | 'pending' | 'answered' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const saved = localStorage.getItem('qna-posts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPosts(parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        })));
      } catch (e) {
        console.error('Failed to load posts:', e);
      }
    }
  }, []);

  // 로컬 스토리지에 데이터 저장
  useEffect(() => {
    localStorage.setItem('qna-posts', JSON.stringify(posts));
  }, [posts]);

  // 게시물 필터링
  const getFilteredPosts = useCallback(() => {
    let filtered = posts;

    // 서비스 필터
    if (filteredService !== 'all') {
      filtered = filtered.filter(p => p.service === filteredService);
    }

    // 상태 필터
    if (filteredStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filteredStatus);
    }

    // 검색어 필터
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.content.toLowerCase().includes(term) ||
        p.author.toLowerCase().includes(term)
      );
    }

    // 정렬
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return filtered;
  }, [posts, filteredService, filteredStatus, searchTerm, sortBy]);

  // 게시물 추가
  const addPost = useCallback((data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: Post = {
      ...data,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  }, []);

  // 게시물 수정
  const updatePost = useCallback((id: string, data: Partial<Omit<Post, 'id' | 'createdAt'>>) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, ...data, updatedAt: new Date() }
          : p
      )
    );
  }, []);

  // 게시물 삭제
  const deletePost = useCallback((id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  }, []);

  // 게시물 조회
  const getPost = useCallback((id: string) => {
    return posts.find(p => p.id === id);
  }, [posts]);

  return {
    posts,
    filteredService,
    setFilteredService,
    filteredStatus,
    setFilteredStatus,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    getFilteredPosts,
    addPost,
    updatePost,
    deletePost,
    getPost
  };
}
