import React from "react";
import { Trash2, HeartOff } from "lucide-react";

interface WishlistItem {
  id: number;
  name: string;
  image: string;
  location: string;
  price: string;
}

interface WishlistLayerProps {
  isOpen: boolean;
  wishlist: WishlistItem[];
  onClose: () => void;
  onRemove: (id: number) => void;
}

export default function WishlistLayer({ isOpen, wishlist, onClose, onRemove }: WishlistLayerProps) {
  return (
    <>
      <div 
        className={`modal-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose} 
      />
      <div className={`wishlist-window ${isOpen ? 'is-active' : ''}`}>
        <div className="wishlist-header">
          <h3>MY STAY PICK</h3>
          <button className="close-wishlist" onClick={onClose}>×</button>
        </div>
        <div className="wishlist-content">
          {wishlist.length === 0 ? (
            <div className="wishlist-empty">
              <HeartOff size={48} className="text-slate-300 mb-4" />
              <p>저장된 숙소가 없습니다.</p>
              <button 
                className="btn-explore" 
                onClick={onClose}
              >
                숙소 둘러보기
              </button>
            </div>
          ) : (
            wishlist.map(item => (
              <div key={item.id} className="wishlist-item-card">
                <img src={item.image} alt={item.name} className="wishlist-thumb" />
                <div className="wishlist-info">
                  <div className="wishlist-top">
                    <span className="wishlist-location">{item.location}</span>
                    <button 
                      className="wishlist-remove"
                      onClick={() => onRemove(item.id)}
                    >
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
    </>
  );
}
