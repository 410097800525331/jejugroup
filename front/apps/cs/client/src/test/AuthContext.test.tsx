import { useEffect, useState, type ReactNode } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const mocks = vi.hoisted(() => ({
  getSessionUser: vi.fn(),
}));

vi.mock("@/lib/serviceCenterApi", () => ({
  getSessionUser: mocks.getSessionUser,
}));

function SessionConsumer() {
  const { user, sessionState } = useAuth();

  return (
    <div>
      <output data-testid="session-state">{sessionState}</output>
      <output data-testid="session-user">{user?.name ?? "guest"}</output>
    </div>
  );
}

function AdminGateConsumer() {
  const { isAdmin, sessionState, user } = useAuth();

  return (
    <div>
      <output data-testid="session-state">{sessionState}</output>
      <output data-testid="session-user">{user?.name ?? "guest"}</output>
      {isAdmin ? <output data-testid="admin-ui">admin</output> : null}
    </div>
  );
}

function SessionUpdateHarness({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handleSessionUpdate = () => {
      setVersion((currentVersion) => currentVersion + 1);
    };

    window.addEventListener("jeju:session-updated", handleSessionUpdate);

    return () => {
      window.removeEventListener("jeju:session-updated", handleSessionUpdate);
    };
  }, []);

  return <AuthProvider key={version}>{children}</AuthProvider>;
}

describe("AuthContext", () => {
  beforeEach(() => {
    mocks.getSessionUser.mockReset();
  });

  it("re-hydrates the session flow when jeju:session-updated fires", async () => {
    mocks.getSessionUser
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: {
          id: "user-1",
          name: "홍길동",
          email: "hong@example.com",
          phone: "01012345678",
        },
        error: null,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: {
          id: "user-1",
          name: "홍길동",
          email: "hong@example.com",
          phone: "01012345678",
        },
        error: null,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: {
          id: "user-2",
          name: "김철수",
          email: "kim@example.com",
          phone: "01087654321",
        },
        error: null,
      });

    render(
      <SessionUpdateHarness>
        <SessionConsumer />
      </SessionUpdateHarness>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("session-state")).toHaveTextContent("success");
      expect(screen.getByTestId("session-user")).toHaveTextContent("홍길동");
    });

    await act(async () => {
      window.dispatchEvent(new CustomEvent("jeju:session-updated"));
    });

    await waitFor(() => {
      expect(mocks.getSessionUser.mock.calls.length).toBeGreaterThanOrEqual(3);
      expect(screen.getByTestId("session-state")).toHaveTextContent("success");
      expect(screen.getByTestId("session-user")).toHaveTextContent("김철수");
    });
  });

  it("does not open admin UI for non-ADMIN sessions", async () => {
    mocks.getSessionUser.mockResolvedValueOnce({
      ok: true,
      status: 200,
      data: {
        id: "user-3",
        name: "비관리자",
        email: "member@example.com",
        phone: "01000000000",
        role: "MEMBER",
        roles: ["MEMBER"],
        isLocalAdmin: false,
      },
      error: null,
    });

    render(
      <AuthProvider>
        <AdminGateConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("session-state")).toHaveTextContent("success");
      expect(screen.getByTestId("session-user")).toHaveTextContent("비관리자");
    });

    expect(screen.queryByTestId("admin-ui")).toBeNull();
  });
});
