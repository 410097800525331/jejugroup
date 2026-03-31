import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Circle } from "lucide-react";

import FAQItem from "@/components/serviceCenter/FAQItem";
import InquirySupportAttachments from "@/components/serviceCenter/InquirySupportAttachments";
import InquirySupportComments from "@/components/serviceCenter/InquirySupportComments";
import NoticeListItem from "@/components/serviceCenter/NoticeListItem";
import Inquiries from "@/pages/Inquiries";
import { updateFaq } from "@/lib/serviceCenterApi";

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  listMyTickets: vi.fn(),
  getTicketDetail: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: mocks.useAuth,
}));

vi.mock("@/lib/serviceCenterApi", async () => {
  const actual = await vi.importActual<typeof import("@/lib/serviceCenterApi")>("@/lib/serviceCenterApi");

  return {
    ...actual,
    listMyTickets: mocks.listMyTickets,
    getTicketDetail: mocks.getTicketDetail,
  };
});

const memberAuth = {
  user: {
    id: "user-1",
    name: "User",
    role: "MEMBER",
    roles: ["MEMBER"],
    isLocalAdmin: false,
  },
  isAuthenticated: true,
  sessionState: "success",
  sessionError: null,
};

const jsonResponse = (payload: unknown, init: ResponseInit = {}) =>
  ({
    ok: (init.status ?? 200) >= 200 && (init.status ?? 200) < 300,
    status: init.status ?? 200,
    text: async () => JSON.stringify(payload),
  }) as Response;

const emptyJsonResponse = (init: ResponseInit = {}) =>
  ({
    ok: (init.status ?? 200) >= 200 && (init.status ?? 200) < 300,
    status: init.status ?? 200,
    text: async () => "",
  }) as Response;

const makeFetchMock = () =>
  vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = (init?.method ?? "GET").toUpperCase();

    if (url.includes("/comments")) {
      if (method === "GET") {
        return jsonResponse({ comments: [] });
      }

      return emptyJsonResponse({ status: 204 });
    }

    if (url.includes("/attachments")) {
      if (method === "GET") {
        return jsonResponse({ attachments: [] });
      }

      return emptyJsonResponse({ status: 204 });
    }

    if (url.includes("/api/customer-center/faqs/")) {
      return jsonResponse({ faq: { id: 7 } });
    }

    throw new Error(`unexpected fetch: ${method} ${url}`);
  });

beforeEach(() => {
  mocks.useAuth.mockReset();
  mocks.listMyTickets.mockReset();
  mocks.getTicketDetail.mockReset();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ServiceCenter regressions", () => {
  it("shows and hides notice admin actions by isAdmin prop", () => {
    const adminOnEdit = vi.fn();
    const adminOnDelete = vi.fn();

    const { container: adminContainer } = render(
      <NoticeListItem
        id={1}
        index={0}
        service="common"
        title="notice"
        date="2026.03.23"
        excerpt="excerpt"
        color="orange"
        icon={Circle}
        active={true}
        isAdmin={true}
        onEdit={adminOnEdit}
        onDelete={adminOnDelete}
      />,
    );

    expect(adminContainer.querySelectorAll("button").length).toBeGreaterThan(1);

    cleanup();

    const { container: guestContainer } = render(
      <NoticeListItem
        id={1}
        index={0}
        service="common"
        title="notice"
        date="2026.03.23"
        excerpt="excerpt"
        color="orange"
        icon={Circle}
        active={true}
        isAdmin={false}
      />,
    );

    expect(guestContainer.querySelectorAll("button")).toHaveLength(0);
  });

  it("shows and hides FAQ admin actions by isAdmin prop", () => {
    const adminOnEdit = vi.fn();
    const adminOnDelete = vi.fn();

    const { container: adminContainer } = render(
      <FAQItem
        id={1}
        service="common"
        question="faq"
        answer="answer"
        category="booking"
        isExpanded={false}
        isAdmin={true}
        onToggle={vi.fn()}
        onEdit={adminOnEdit}
        onDelete={adminOnDelete}
      />,
    );

    expect(adminContainer.querySelectorAll("button")).toHaveLength(3);

    cleanup();

    const { container: guestContainer } = render(
      <FAQItem
        id={1}
        service="common"
        question="faq"
        answer="answer"
        category="booking"
        isExpanded={false}
        isAdmin={false}
        onToggle={vi.fn()}
        onEdit={adminOnEdit}
        onDelete={adminOnDelete}
      />,
    );

    expect(guestContainer.querySelectorAll("button")).toHaveLength(1);
  });

  it("keeps an explicit FAQ sortOrder in the update body", async () => {
    const fetchMock = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>(async () => jsonResponse({ faq: { id: 7 } }));
    vi.stubGlobal("fetch", fetchMock);

    await updateFaq(7, {
      serviceType: "common",
      category: "booking",
      question: "FAQ payload check",
      answer: "answer",
      sortOrder: 7,
      active: true,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const firstCall = fetchMock.mock.calls[0];
    if (!firstCall) {
      throw new Error("expected fetch to be called");
    }

    const [url, init] = firstCall;
    expect(String(url)).toBe("/api/customer-center/faqs/7");
    expect(init?.method).toBe("PUT");
    expect(JSON.parse(String(init?.body))).toMatchObject({
      serviceType: "common",
      category: "booking",
      question: "FAQ payload check",
      answer: "answer",
      sortOrder: 7,
      active: true,
    });
  });

  it("keeps inactive notices inactive when the edit payload is built", () => {
    const onEdit = vi.fn();
    const { container } = render(
      <NoticeListItem
        id={31}
        index={0}
        service="common"
        title="inactive-notice"
        date="2026.03.23"
        excerpt="excerpt"
        color="orange"
        icon={Circle}
        active={false}
        isAdmin={true}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );

    for (const button of Array.from(container.querySelectorAll("button"))) {
      fireEvent.click(button);
    }

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 31,
        active: false,
        title: "inactive-notice",
      }),
    );
  });

  it("renders the inquiry support comment and attachment sections for the owner path", async () => {
    mocks.useAuth.mockReturnValue(memberAuth);

    const fetchMock = makeFetchMock();
    vi.stubGlobal("fetch", fetchMock);

    render(
      <div>
        <InquirySupportComments ticketId={101} ticketOwnerId="user-1" ticketTitle="문의 101" />
        <InquirySupportAttachments ticketId={101} ticketOwnerId="user-1" ticketTitle="문의 101" ticketStatus="pending" />
      </div>,
    );

    await waitFor(() => {
      expect(screen.getByText("support comments")).toBeInTheDocument();
      expect(screen.getByText("attachments metadata")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "댓글 등록" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "메타데이터 등록" })).toBeEnabled();
    expect(fetchMock).toHaveBeenCalled();
  });

  it.each(["answered", "resolved", "closed"])("treats %s inquiry status as completed in the UI", async (status) => {
    mocks.useAuth.mockReturnValue(memberAuth);
    mocks.listMyTickets.mockResolvedValue({
      ok: true,
      status: 200,
      data: [
        {
          id: 101,
          title: "status regression ticket",
          status,
          serviceType: "common",
          createdAt: "2026-03-23T00:00:00Z",
        },
      ],
      error: null,
    });

    render(<Inquiries />);

    await waitFor(() => {
      expect(mocks.listMyTickets).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("button", { name: /status regression ticket/i })).toBeInTheDocument();
    });

    const inquiryButton = screen.getByRole("button", { name: /status regression ticket/i });
    expect(inquiryButton).toHaveTextContent("완료");
  });
});
