import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * 모바일/웹 통합 고객센터를 위한 상위 레벨 권한 관리 Context
 * 릴레이 프로젝트 특성상 실제 구현은 로컬스토리지나 쿠키 기반일 것이나,
 * 현재는 리팩토링 및 아키텍처 수립을 위해 Mock으로 구현함
 */
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 실제 연동 전까지는 강제로 로그인된 상태인 척 할 수도 있음 (테스트용)
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: any) => {
    // Mock Login
    console.log("Mock Login with:", credentials);
    setUser({
      id: "jeju-user-01",
      name: "이지은",
      email: "jieun@jejuair.com",
      phone: "010-1234-5678",
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
