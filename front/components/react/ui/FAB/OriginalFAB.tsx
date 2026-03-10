import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { 
  Home, 
  ArrowUp, 
  Globe, 
  Heart, 
  MessageCircle, 
  X,
  Trash2,
  HeartOff
} from "lucide-react";

// Register GSAP plugin
gsap.registerPlugin(useGSAP);

interface WishlistItem {
  id: number;
  name: string;
  image: string;
  location: string;
  price: string;
}

/**
 * 제주 그룹 오리지널 'Hotel Card-Key' FAB (React Perfect Port)
 * 원본의 GSAP 애니메이션, 디자인, 로직을 1:1로 이식함
 */
export default function OriginalFAB() {
  const container = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(JSON.parse(localStorage.getItem('jeju_wishlist') || '[]'));
  const [currency, setCurrency] = useState(localStorage.getItem('jeju_fab_currency') || 'KRW');
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 1. 초기 상태 및 동기화
  useEffect(() => {
    const handleWishlistUpdate = (e: any) => setWishlist(e.detail);
    document.addEventListener('fabWishlistUpdated', handleWishlistUpdate);
    return () => document.removeEventListener('fabWishlistUpdated', handleWishlistUpdate);
  }, []);

  // 2. GSAP 애니메이션 (원본 로직 완벽 재현)
  const { contextSafe } = useGSAP({ scope: container });

  const toggleFab = contextSafe(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1600);

    const tl = gsap.timeline();
    const cards = ".fab-card";
    const holder = ".card-holder";

    if (!isOpen) {
      // Opening Sequence
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
      // Closing Sequence
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

  // 3. 카드 액션 처리
  const handleCurrencyToggle = () => {
    const nextCurr = currency === 'KRW' ? 'USD' : 'KRW';
    setCurrency(nextCurr);
    localStorage.setItem('jeju_fab_currency', nextCurr);
    document.dispatchEvent(new CustomEvent('fabCurrencyChanged', { detail: nextCurr }));
  };

  const openWishlist = () => {
    setIsWishlistOpen(true);
  };

  return (
    <div ref={container} className="original-fab-system">
      {/* 1. 모달 레이어 (위시리스트) */}
      <div className={`modal-overlay ${isWishlistOpen ? 'active' : ''}`} onClick={() => setIsWishlistOpen(false)} />
      <div className={`wishlist-window ${isWishlistOpen ? 'is-active' : ''}`}>
        <div className="wishlist-header">
          <h3>MY STAY PICK</h3>
          <button className="close-wishlist" onClick={() => setIsWishlistOpen(false)}>×</button>
        </div>
        <div className="wishlist-content">
          {wishlist.length === 0 ? (
            <div className="wishlist-empty">
              <HeartOff size={48} className="text-slate-300 mb-4" />
              <p>저장된 숙소가 없습니다.</p>
              <button className="btn-explore" onClick={() => setIsWishlistOpen(false)}>숙소 둘러보기</button>
            </div>
          ) : (
            wishlist.map(item => (
              <div key={item.id} className="wishlist-item-card">
                <img src={item.image} alt={item.name} className="wishlist-thumb" />
                <div className="wishlist-info">
                  <div className="wishlist-top">
                    <span className="wishlist-location">{item.location}</span>
                    <button className="wishlist-remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h4 className="wishlist-title">{item.name}</h4>
                  <div className="wishlist-price">{item.price}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. 카드 홀더 */}
      <div className="fab-wrapper">
        <div className="card-holder" onClick={toggleFab}>
          <div className="fab-peek"></div>
          <div className="fab-body"></div>
        </div>

        {/* 3. 카드 리스트 */}
        <div className="fab-cards-container">
          <div className="fab-card card-0" onClick={() => window.location.href = "/"}>
            <Home className="card-icon" />
            <span className="card-label">HOME</span>
          </div>
          <div className="fab-card card-1" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <ArrowUp className="card-icon" />
            <span className="card-label">TOP</span>
          </div>
          <div className="fab-card card-2" onClick={handleCurrencyToggle}>
            <Globe className="card-icon" />
            <span className="card-label">{currency === 'KRW' ? 'KOR' : 'ENG'}</span>
          </div>
          <div className="fab-card card-3" onClick={openWishlist}>
            <Heart className="card-icon" />
            <span className="card-label">PICK</span>
            <span className="fab-badge">{wishlist.length}</span>
          </div>
          <div className="fab-card card-4">
            <MessageCircle className="card-icon" />
            <span className="card-label">CHAT</span>
          </div>
        </div>
      </div>

      {/* 스타일은 외부 CSS 파일 사용 (원본 CSS 100% 활용) */}
      <style>{`
        .fab-wrapper { position: fixed; bottom: 40px; right: 40px; z-index: 9999; }
        .card-holder { position: absolute; bottom: 0; right: 0; width: 60px; height: 80px; z-index: 10001; cursor: pointer; }
        .fab-peek { position: absolute; top: -12px; left: 5px; width: 50px; height: 30px; background: linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%); border-radius: 8px 8px 0 0; border: 1px solid rgba(0,0,0,0.06); }
        .fab-peek::before { content: ''; position: absolute; top: 12px; left: 6px; width: 12px; height: 9px; border-radius: 2px; background: repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px), linear-gradient(135deg, #e6c13b 0%, #f0d575 50%, #c49f18 100%); }
        .fab-body { position: absolute; bottom: 0; width: 60px; height: 80px; background-color: #FF5000; border-radius: 8px; z-index: 1; outline: 1.5px dashed rgba(255,255,255,0.9); outline-offset: -4px; border-top: 2px solid #E05000; box-shadow: 0 4px 0 rgba(0,0,0,0.1), inset 0 3px 6px rgba(0,0,0,0.15); }
        .fab-body::after { content: 'JEJU\\A GROUP'; white-space: pre; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 11px; text-transform: uppercase; font-weight: 800; text-align: center; line-height: 1.2; color: #FFFFFF; }
        .fab-cards-container { position: absolute; bottom: 0; right: 0; width: 65px; height: 95px; z-index: 10000; pointer-events: none; clip-path: inset(-200% -200% 0 -600%); }
        .fab-card { position: absolute; bottom: 0; left: 0; width: 65px; height: 95px; background: linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%); border-radius: 10px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; opacity: 0; pointer-events: none; border: 1px solid rgba(0,0,0,0.06); }
        .fab-card::before { content: ''; position: absolute; top: 10px; left: 8px; width: 12px; height: 9px; border-radius: 2px; background: repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px), linear-gradient(135deg, #e6c13b 0%, #f0d575 50%, #c49f18 100%); }
        .fab-card::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: #FF5C00; }
        .card-icon { width: 20px; height: 20px; color: #333; margin-bottom: 3px; stroke-width: 2.5px; }
        .card-label { font-size: 10.5px; font-weight: 700; color: #333; text-transform: uppercase; letter-spacing: 1.2px; }
        .fab-badge { position: absolute; top: 6px; right: 6px; background: #FF5C00; color: white; font-size: 9px; font-weight: bold; min-width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        
        .wishlist-window { position: fixed; z-index: 10002; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(15px); border-radius: 10px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.2); display: none; flex-direction: column; transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        .wishlist-window.is-active { display: flex; top: 50% !important; left: 50% !important; width: 400px !important; height: 500px !important; transform: translate(-50%, -50%) !important; border-radius: 20px; }
        .wishlist-header { background: #FF5C00; color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; }
        .wishlist-content { padding: 20px; flex: 1; overflow-y: auto; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 10001; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; }
        .modal-overlay.active { opacity: 1; pointer-events: auto; }
        .wishlist-item-card { display: flex; gap: 12px; padding: 12px; border-bottom: 1px solid #eee; background: #fff; border-radius: 8px; margin-bottom: 10px; }
        .wishlist-thumb { width: 80px; height: 80px; border-radius: 6px; object-fit: cover; }
      `}</style>
    </div>
  );
}
