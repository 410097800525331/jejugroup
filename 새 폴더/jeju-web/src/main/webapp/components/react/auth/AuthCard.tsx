import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export const AuthCard = ({ children, className = "" }: AuthCardProps) => {
  return <div className={["user_box", "inner2", "login-card", className].filter(Boolean).join(" ")}>{children}</div>;
};
