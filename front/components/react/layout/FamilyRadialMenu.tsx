import "./family-radial-menu.css";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { Building2, Car, Home, Plane } from "lucide-react";
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

type SharedFamilyRadialMenuProps = Omit<FamilyRadialMenuProps, "items" | "originX" | "radiusPx">;

export const JEJU_GROUP_FAMILY_RADIAL_ITEMS: FamilyRadialMenuItem[] = [
  {
    href: "/index.html",
    icon: Home,
    key: "main",
    title: "제주그룹 메인",
  },
  {
    href: "/jejuair/index.html",
    icon: Plane,
    key: "air",
    title: "제주에어",
  },
  {
    href: "/jejustay/pages/hotel/jejuhotel.html",
    icon: Building2,
    key: "stay",
    title: "제주스테이",
  },
  {
    href: "https://jejurentcar.netlify.app/",
    icon: Car,
    key: "rentcar",
    rel: "noreferrer",
    target: "_blank",
    title: "제주렌터카",
  },
];

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
  startAngle,
  endAngle,
}: FamilyRadialMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const resolvedStartAngle = startAngle ?? 180;
  const resolvedEndAngle = endAngle ?? 270;

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
    <div className={`family-radial-shell family-radial-shell--${originX}`}>
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
                style={createRadialItemStyle(index, items.length, radiusPx, resolvedStartAngle, resolvedEndAngle)}
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

export function JejuGroupFamilyRadialMenu(props: SharedFamilyRadialMenuProps) {
  return <FamilyRadialMenu items={JEJU_GROUP_FAMILY_RADIAL_ITEMS} originX="center" radiusPx={98} {...props} />;
}
