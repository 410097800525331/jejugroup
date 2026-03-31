import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  id: string;
  className: string;
  label: string;
  icon: LucideIcon;
  badgeCount?: number;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const ActionCard = forwardRef<HTMLDivElement, ActionCardProps>(
  ({ id, className, label, icon: Icon, badgeCount, onClick, onMouseEnter, onMouseLeave }, ref) => {
    return (
      <div 
        id={id}
        ref={ref}
        className={`fab-card ${className}`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Icon className="card-icon" />
        <span className="card-label">{label}</span>
        {badgeCount !== undefined && badgeCount > 0 && (
          <span className="fab-badge">{badgeCount}</span>
        )}
      </div>
    );
  }
);

ActionCard.displayName = "ActionCard";
export default ActionCard;
