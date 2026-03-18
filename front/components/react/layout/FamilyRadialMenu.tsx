import "./family-radial-menu.css";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

export interface FamilyRadialMenuItem {
  href: string;
  icon: LucideIcon;
  key: string;
  rel?: string;
  target?: string;
  title: string;
}

interface FamilyRadialMenuProps {
  items: FamilyRadialMenuItem[];
  label?: string;
  originX?: "center" | "right";
  radiusPx?: number;
  startAngle?: number;
  endAngle?: number;
}

const toRadians = (degree: number) => (degree * Math.PI) / 180;

const createRadialItemStyle = (
  index: number,
  total: number,
  radiusPx: number,
  startAngle: number,
  endAngle: number,
): CSSProperties => {
  const angleStep = total > 1 ? (endAngle - startAngle) / (total - 1) : 0;
  const angle = startAngle + angleStep * index;
  const radian = toRadians(angle);
  const tx = Math.cos(radian) * radiusPx;
  const ty = Math.sin(radian) * radiusPx;

  return {
    "--tx": `${tx.toFixed(2)}px`,
    "--ty": `${ty.toFixed(2)}px`,
    transitionDelay: `${(index * 0.03).toFixed(2)}s`,
  } as CSSProperties;
};

export default function FamilyRadialMenu({
  items,
  label = "Family Sites",
  originX = "right",
  radiusPx = 98,
  startAngle = 180,
  endAngle = 270,
}: FamilyRadialMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="family-radial-shell">
      <div
        className={`family-radial-menu family-radial-menu--${originX} ${isMenuOpen ? "active" : ""}`}
        ref={menuRef}
      >
        <button
          type="button"
          className={`family-radial-btn ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={label}
          title={label}
        >
          <span className="family-radial-btn__glyph" aria-hidden="true" />
        </button>

        <div className="family-radial-items">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <a
                key={item.key}
                className="family-radial-item"
                href={item.href}
                rel={item.rel}
                style={createRadialItemStyle(index, items.length, radiusPx, startAngle, endAngle)}
                target={item.target}
                title={item.title}
              >
                <Icon size={18} strokeWidth={2.2} />
              </a>
            );
          })}
        </div>
      </div>

      {label ? <p className="family-radial-label">{label}</p> : null}
    </div>
  );
}
