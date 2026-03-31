import { useState, useCallback } from "react";
import type { ItineraryCompanion } from "./types";

interface UseCompanionManagerProps {
  initialCompanions?: ItineraryCompanion[];
  lookupMemberById?: CompanionMemberLookup;
}

type CompanionMemberLookup = (memberId: string) => Promise<ItineraryCompanion | null>;

// 실제 DB/API 연동 시 이 디렉터리 조회 함수만 교체하면 되게 분리한다.
const MOCK_MEMBER_DIRECTORY: Record<string, Omit<ItineraryCompanion, "isMember">> = {
  "park_jy": { id: "park_jy", name: "박준영" },
  "lee_je": { id: "lee_je", name: "이지은" },
  "choi_sj": { id: "choi_sj", name: "최수진" },
};

const normalizeMemberId = (value: string) => value.trim().toLowerCase();

const defaultLookupMemberById: CompanionMemberLookup = async (memberId) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const found = MOCK_MEMBER_DIRECTORY[memberId];
  if (!found) {
    return null;
  }

  return {
    ...found,
    isMember: true,
  };
};

export const useCompanionManager = ({
  initialCompanions = [],
  lookupMemberById = defaultLookupMemberById,
}: UseCompanionManagerProps = {}) => {
  const [companions, setCompanions] = useState<ItineraryCompanion[]>(initialCompanions);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<ItineraryCompanion | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorObj, setErrorObj] = useState<{ message: string } | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    const normalizedQuery = normalizeMemberId(query);

    if (!normalizedQuery) {
      setErrorObj({ message: "검색할 제주그룹 회원 ID를 입력해라" });
      setSearchResult(null);
      return;
    }

    if (!/^[a-z0-9._-]{2,30}$/i.test(normalizedQuery)) {
      setErrorObj({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" });
      setSearchResult(null);
      return;
    }

    setIsSearching(true);
    setErrorObj(null);
    setSearchResult(null);

    try {
      const found = await lookupMemberById(normalizedQuery);
      if (found) {
        setSearchResult(found);
      } else {
        setErrorObj({ message: "일치하는 제주그룹 회원 ID를 찾지 못했다" });
      }
    } catch (_error) {
      setErrorObj({ message: "회원 조회 중 오류가 발생했다. 잠시 후 다시 시도해라" });
    } finally {
      setIsSearching(false);
    }
  }, [lookupMemberById]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResult(null);
    setErrorObj(null);
  }, []);

  const addCompanion = useCallback((companion: ItineraryCompanion) => {
    setCompanions((prev) => {
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
