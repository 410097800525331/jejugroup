import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { 
  Home, 
  ArrowUp, 
  Globe, 
  Heart, 
  MessageCircle 
} from "lucide-react";
import ActionCard from "./ActionCard";
import WishlistLayer from "./WishlistLayer";
import CardHolder from "./CardHolder";

// GSAP 플러그인 등록 (필요한 경우 여기에 추가)
if (typeof window !== "undefined") {
  // gsap.registerPlugin(ScrollTrigger, etc); 
}

interface WishlistItem {
  id: number;
  name: string;
  image: string;
  location: string;
  price: string;
}

/**
 * 최종 조립된 전역 FAB 컨테이너
 * 원본 로직 + 원자적 구조
 */
export default function FABContainer() {
  const container = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('jeju_wishlist') || '[]');
    } catch {
      return [];
    }
  });
  const [currency, setCurrency] = useState(() => localStorage.getItem('jeju_fab_currency') || 'KRW');
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const syncWishlist = (e: any) => setWishlist(e.detail);
    document.addEventListener('fabWishlistUpdated', syncWishlist);
    return () => document.removeEventListener('fabWishlistUpdated', syncWishlist);
  }, []);

  const { contextSafe } = useGSAP({ scope: container });

  const toggleFab = contextSafe(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1600);

    const tl = gsap.timeline();
    const cards = ".fab-card";
    const holder = ".card-holder";

    if (!isOpen) {
      gsap.set(cards, { opacity: 1, pointerEvents: "auto", display: "flex" });
      tl.fromTo(cards, 
        { y: 20, opacity: 0 },
        { y: -100, opacity: 1, duration: 0.6, ease: "power3.out" }
      )
      .to(".card-0", { x: -300, duration: 1.0, ease: "elastic.out(1.2, 0.5)" })
      .to(".card-1", { x: -225, duration: 1.0, ease: "elastic.out(1.2, 0.5)" }, "-=0.85")
      .to(".card-2", { x: -150, duration: 1.0, ease: "elastic.out(1.2, 0.5)" }, "-=0.9")
      .to(".card-3", { x: -75, duration: 1.0, ease: "elastic.out(1.2, 0.5)" }, "-=0.9")
      .to(".card-4", { x: 0, duration: 1.0, ease: "elastic.out(1.2, 0.5)" }, "-=0.9");
      gsap.to(holder, { y: 5, opacity: 0.9, duration: 0.3 });
    } else {
      gsap.set(cards, { pointerEvents: "none" });
      tl.to(".card-0", { x: -225, duration: 0.15, ease: "power2.in" })
        .to([".card-0", ".card-1"], { x: -150, duration: 0.15, ease: "power2.in" })
        .to([".card-0", ".card-1", ".card-2"], { x: -75, duration: 0.15, ease: "power2.in" })
        .to([".card-0", ".card-1", ".card-2", ".card-3"], { x: 0, duration: 0.15, ease: "power2.in" })
        .to(cards, { y: 20, opacity: 0, duration: 0.3, ease: "power3.in" });
      gsap.to(holder, { y: 0, opacity: 1, duration: 0.3 });
    }
    setIsOpen(!isOpen);
  });

  const handleCardHover = contextSafe((selector: string, isEnter: boolean) => {
    if (isOpen) {
      gsap.to(selector, { 
        y: isEnter ? -110 : -100, 
        duration: 0.3, 
        ease: "power2.out", 
        overwrite: "auto" 
      });
    }
  });

  const handleCurrencyToggle = () => {
    const nextCurr = currency === 'KRW' ? 'USD' : 'KRW';
    setCurrency(nextCurr);
    localStorage.setItem('jeju_fab_currency', nextCurr);
    document.dispatchEvent(new CustomEvent('fabCurrencyChanged', { detail: nextCurr }));
  };

  const removeWishlist = (id: number) => {
    const newWishlist = wishlist.filter((i: WishlistItem) => i.id !== id);
    setWishlist(newWishlist);
    localStorage.setItem('jeju_wishlist', JSON.stringify(newWishlist));
    document.dispatchEvent(new CustomEvent('fabWishlistUpdated', { detail: newWishlist }));
  };

  return (
    <div ref={container} className="original-fab-system">
      <WishlistLayer 
        isOpen={isWishlistOpen} 
        wishlist={wishlist} 
        onClose={() => setIsWishlistOpen(false)}
        onRemove={removeWishlist}
      />

      <div className="fab-wrapper">
        <CardHolder onClick={toggleFab} isOpen={isOpen} />

        <div className="fab-cards-container">
          <ActionCard 
            id="fabHome"
            className="card-0"
            label="HOME"
            icon={Home}
            onClick={() => window.location.href = "/"}
            onMouseEnter={() => handleCardHover(".card-0", true)}
            onMouseLeave={() => handleCardHover(".card-0", false)}
          />
          <ActionCard 
            id="fabTop"
            className="card-1"
            label="TOP"
            icon={ArrowUp}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            onMouseEnter={() => handleCardHover(".card-1", true)}
            onMouseLeave={() => handleCardHover(".card-1", false)}
          />
          <ActionCard 
            id="fabCurrency"
            className="card-2"
            label={currency === 'KRW' ? 'KOR' : 'ENG'}
            icon={Globe}
            onClick={handleCurrencyToggle}
            onMouseEnter={() => handleCardHover(".card-2", true)}
            onMouseLeave={() => handleCardHover(".card-2", false)}
          />
          <ActionCard 
            id="fabWishlist"
            className="card-3"
            label="PICK"
            icon={Heart}
            badgeCount={wishlist.length}
            onClick={() => setIsWishlistOpen(true)}
            onMouseEnter={() => handleCardHover(".card-3", true)}
            onMouseLeave={() => handleCardHover(".card-3", false)}
          />
          <ActionCard 
            id="fabChatbot"
            className="card-4"
            label="CHAT"
            icon={MessageCircle}
            onMouseEnter={() => handleCardHover(".card-4", true)}
            onMouseLeave={() => handleCardHover(".card-4", false)}
          />
        </div>
      </div>

      <style>{`
        /* 원본 CSS 로직 그대로 유지 */
        .fab-wrapper { position: fixed; bottom: 40px; right: 40px; z-index: 9999; }
        .card-holder { position: absolute; bottom: 0; right: 0; width: 60px; height: 80px; z-index: 10001; cursor: pointer; }
        .fab-peek { position: absolute; top: -12px; left: 5px; width: 50px; height: 30px; background: linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%); border-radius: 8px 8px 0 0; border: 1px solid rgba(0,0,0,0.06); }
        .fab-peek::before { content: ''; position: absolute; top: 12px; left: 6px; width: 12px; height: 9px; border-radius: 2px; background: repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px), linear-gradient(135deg, #e6c13b 0%, #f0d575 50%, #c49f18 100%); }
        .fab-body { position: absolute; bottom: 0; width: 60px; height: 80px; background-color: #FF5000; border-radius: 8px; z-index: 1; outline: 1.5px dashed rgba(255,255,255,0.9); outline-offset: -4px; border-top: 2px solid #E05000; box-shadow: 0 4px 0 rgba(0,0,0,0.1), inset 0 3px 6px rgba(0,0,0,0.15); }
        .fab-body::after { content: 'JEJU GROUP'; white-space: pre; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 11px; text-transform: uppercase; font-weight: 800; text-align: center; line-height: 1.2; color: #FFFFFF; }
        .fab-cards-container { position: absolute; bottom: 0; right: 0; width: 65px; height: 95px; z-index: 10000; pointer-events: none; clip-path: inset(-200% -200% 0 -600%); }
        .fab-card { position: absolute; bottom: 0; left: 0; width: 65px; height: 95px; background: linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%); border-radius: 10px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; opacity: 0; pointer-events: none; border: 1px solid rgba(0,0,0,0.06); }
        .fab-card::before { content: ''; position: absolute; top: 10px; left: 8px; width: 12px; height: 9px; border-radius: 2px; background: repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px), linear-gradient(135deg, #e6c13b 0%, #f0d575 50%, #c49f18 100%); }
        .fab-card::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: #FF5C00; }
        .card-icon { width: 20px; height: 20px; color: #333; margin-bottom: 3px; stroke-width: 2.5px; }
        .card-label { font-size: 10.5px; font-weight: 700; color: #333; text-transform: uppercase; letter-spacing: 1.2px; }
        .fab-badge { position: absolute; top: 6px; right: 6px; background: #FF5C00; color: white; font-size: 9px; font-weight: bold; min-width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .wishlist-window { position: fixed; z-index: 10002; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(15px); border-radius: 10px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.2); display: none; flex-direction: column; transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        .wishlist-window.is-active { display: flex; top: 50% !important; left: 50% !important; width: 400px !important; height: 500px !important; transform: translate(-50%, -50%) !important; border-radius: 20px; }
        .wishlist-header { background: #FF5C00; color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 20px 20px 0 0; }
        .wishlist-header h3 { margin: 0; font-size: 18px; font-weight: 900; }
        .wishlist-content { padding: 20px; flex: 1; overflow-y: auto; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 10001; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; }
        .modal-overlay.active { opacity: 1; pointer-events: auto; }
        .wishlist-item-card { display: flex; gap: 12px; padding: 12px; border-bottom: 1px solid #eee; background: #fff; border-radius: 8px; margin-bottom: 10px; }
        .wishlist-thumb { width: 80px; height: 80px; border-radius: 6px; object-fit: cover; }
        .wishlist-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .wishlist-title { margin: 0 0 4px 0; font-size: 14px; font-weight: 800; }
        .wishlist-price { font-size: 14px; font-weight: 900; color: #FF5C00; }
      `}</style>
    </div>
  );
}
