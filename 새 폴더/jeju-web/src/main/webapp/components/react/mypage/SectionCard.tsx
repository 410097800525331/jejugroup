import type { ReactNode } from "react";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

export const SectionCard = ({ children, className = "" }: SectionCardProps) => {
  const classes = ["bento-box", "soft-radius", className].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
};

