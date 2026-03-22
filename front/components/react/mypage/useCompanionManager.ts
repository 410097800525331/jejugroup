import { useState, useCallback } from "react";
import type { ItineraryCompanion } from "./types";

interface UseCompanionManagerProps {
  initialCompanions?: ItineraryCompanion[];
}

// 목업 데이터: 실제로는 API 페치 들어갈 자리
const MOCK_DB: Record<string, Omit<ItineraryCompanion, "isMember">> = {
  "tester_id": { id: "tester_id", name: "테스터" },
  "jeju_lover": { id: "jeju_lover", name: "제주사랑" },
  "dev_ray": { id: "dev_ray", name: "레이" },
};

export const useCompanionManager = ({ initialCompanions = [] }: UseCompanionManagerProps = {}) => {
  const [companions, setCompanions] = useState<ItineraryCompanion[]>(initialCompanions);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<ItineraryCompanion | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorObj, setErrorObj] = useState<{ message: string } | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    // 널 체크, 길이 체크 (방어적 프로그래밍)
    if (!query || query.trim().length === 0) {
      setErrorObj({ message: "검색할 ID를 입력해라" });
      setSearchResult(null);
      return;
    }
    
    setIsSearching(true);
    setErrorObj(null);
    setSearchResult(null);

    try {
      // API 레이턴시 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      const found = MOCK_DB[query.trim()];
      if (found) {
        setSearchResult({ ...found, isMember: true });
      } else {
        setErrorObj({ message: "존재하지 않는 사용자다" });
      }
    } catch (err) {
      setErrorObj({ message: "검색 중 에러가 발생했다" });
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResult(null);
    setErrorObj(null);
  }, []);

  const addCompanion = useCallback((companion: ItineraryCompanion) => {
    setCompanions((prev) => {
      // 중복 체크 및 불변성 유지 (스프레드 문법 강제)
      if (prev.some((c) => c.id === companion.id)) {
        return prev;
      }
      return [...prev, companion];
    });
    clearSearch();
  }, [clearSearch]);

  const removeCompanion = useCallback((id: string) => {
    setCompanions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // 불필요한 상태 변종 생성 막고 필요한 것만 리턴
  return {
    companions,
    searchQuery,
    setSearchQuery,
    searchResult,
    isSearching,
    errorObj,
    handleSearch,
    addCompanion,
    removeCompanion,
    clearSearch,
  };
};
