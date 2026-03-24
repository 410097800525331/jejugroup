import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { getSessionUser } from "@/lib/serviceCenterApi";
import type { ApiRequestState, ServiceCenterApiError, SessionUser } from "@/types/service-center";

interface AuthContextType {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  sessionState: ApiRequestState;
  sessionError: ServiceCenterApiError | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SESSION_UPDATED_EVENT = "jeju:session-updated";

export function isAdminSessionUser(user: SessionUser | null): boolean {
  return user?.role === "ADMIN";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [sessionState, setSessionState] = useState<ApiRequestState>("loading");
  const [sessionError, setSessionError] = useState<ServiceCenterApiError | null>(null);
  const isAdmin = isAdminSessionUser(user);

  useEffect(() => {
    let active = true;

    const hydrateSession = async () => {
      const result = await getSessionUser();

      if (!active) {
        return;
      }

      if (result.ok) {
        setUser(result.data);
        setSessionError(null);
        setSessionState("success");
        return;
      }

      setUser(null);
      setSessionError(result.error);
      setSessionState("error");
    };

    const handleSessionUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ session?: SessionUser | null }>).detail;

      if (detail?.session === null) {
        setUser(null);
        setSessionError(null);
        setSessionState("success");
        return;
      }

      void hydrateSession();
    };

    void hydrateSession();
    window.addEventListener(SESSION_UPDATED_EVENT, handleSessionUpdate);

    return () => {
      active = false;
      window.removeEventListener(SESSION_UPDATED_EVENT, handleSessionUpdate);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAdmin, sessionState, sessionError }}>
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
