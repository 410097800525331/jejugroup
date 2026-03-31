import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { TravelChecklistSection } from "@front-components/travel/TravelChecklistSection";
import { TRAVEL_CHECKLIST_SECTIONS } from "@front-components/travel/travelChecklistData";
import { useAnimatedNumber } from "@front-components/travel/useAnimatedNumber";

const STORAGE_KEY = "jeju:travel-checklist-items";

const getStoredChecklist = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch (_error) {
    return [];
  }
};

export const TravelChecklistApp = () => {
  const [checkedIds, setCheckedIds] = useState<string[]>(() => getStoredChecklist());
  const [isProgressAnimating, setIsProgressAnimating] = useState(false);
  const [isCompletionCelebrating, setIsCompletionCelebrating] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedIds));
  }, [checkedIds]);

  const totalCount = useMemo(() => {
    return TRAVEL_CHECKLIST_SECTIONS.reduce((count, section) => count + section.items.length, 0);
  }, []);

  const checkedSet = useMemo(() => {
    return new Set(checkedIds);
  }, [checkedIds]);

  const progress = useMemo(() => {
    if (totalCount === 0) {
      return 0;
    }

    return Math.round((checkedIds.length / totalCount) * 100);
  }, [checkedIds.length, totalCount]);

  const animatedProgress = useAnimatedNumber(progress);
  const animatedProgressLabel = useMemo(() => {
    return Math.round(animatedProgress);
  }, [animatedProgress]);
  const previousProgressRef = useRef(progress);
  const isComplete = progress === 100;

  useEffect(() => {
    setIsProgressAnimating(true);
    const timeoutId = window.setTimeout(() => {
      setIsProgressAnimating(false);
    }, 480);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [progress]);

  useEffect(() => {
    const previousProgress = previousProgressRef.current;
    previousProgressRef.current = progress;

    if (progress !== 100 || previousProgress === 100) {
      return undefined;
    }

    setIsCompletionCelebrating(true);
    const timeoutId = window.setTimeout(() => {
      setIsCompletionCelebrating(false);
    }, 1400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [progress]);

  const progressLabel = useMemo(() => {
    if (progress === 100) {
      return "짐 싸기 전에 한 번만 더 훑으면 끝";
    }

    if (progress >= 70) {
      return "거의 다 됨 이제 빠진 것만 마무리";
    }

    if (progress >= 40) {
      return "절반 넘김 아직 헷갈리는 것만 정리하면 됨";
    }

    return "출국 직전에 멘붕 오기 싫으면 지금 채워두는 구간";
  }, [progress]);

  const handleToggle = useCallback((itemId: string) => {
    setCheckedIds((current) => {
      return current.includes(itemId) ? current.filter((value) => value !== itemId) : [...current, itemId];
    });
  }, []);

  const handleReset = useCallback(() => {
    setCheckedIds([]);
  }, []);

  return (
    <div className="travel-checklist-shell">
      <section className="travel-checklist-hero">
        <div className="travel-checklist-hero-copy">
          <span className="travel-checklist-badge">JEJU STAY CHECKLIST</span>
          <h1>출국 직전 체크리스트</h1>
          <p>
            여권, 결제, 통신, 짐 정리까지
            <br />
            마지막에 허둥대지 않게 한 화면에 묶어둔 여행 준비판
          </p>
        </div>
      </section>

      <aside
        className={`travel-checklist-progress-card${isComplete ? " is-complete" : ""}${isCompletionCelebrating ? " is-celebrating" : ""}`}
      >
        <div
          className={`travel-checklist-progress-ring${isProgressAnimating ? " is-animating" : ""}${isComplete ? " is-complete" : ""}${isCompletionCelebrating ? " is-celebrating" : ""}`}
          style={{ "--progress": `${animatedProgress}%` } as CSSProperties}
        >
          <div className="travel-checklist-progress-ring-inner">
            <strong>
              <span className="travel-checklist-progress-value">{animatedProgressLabel}</span>
              <span className="travel-checklist-progress-unit">%</span>
            </strong>
            <span>
              {checkedIds.length} / {totalCount}
            </span>
          </div>
        </div>
        <p className="travel-checklist-progress-label">{progressLabel}</p>
        {isComplete ? (
          <span className={`travel-checklist-complete-badge${isCompletionCelebrating ? " is-celebrating" : ""}`}>
            출국 준비 완료
          </span>
        ) : null}
        <button className="travel-checklist-reset" onClick={handleReset} type="button">
          <RotateCcw size={16} strokeWidth={2.4} />
          초기화
        </button>
      </aside>

      <section className="travel-checklist-summary">
        <div className="travel-checklist-summary-card">
          <Sparkles size={18} strokeWidth={2.3} />
          <div>
            <strong>첫날 동선만큼은 미리 캡처</strong>
            <p>공항에서 숙소까지, 체크인 시간, 현지 결제 수단 세 개만 챙겨도 절반은 안 꼬임</p>
          </div>
        </div>
      </section>

      <section className="travel-checklist-grid">
        {TRAVEL_CHECKLIST_SECTIONS.map((section) => (
          <TravelChecklistSection checkedIds={checkedSet} key={section.id} onToggle={handleToggle} section={section} />
        ))}
      </section>
    </div>
  );
};
