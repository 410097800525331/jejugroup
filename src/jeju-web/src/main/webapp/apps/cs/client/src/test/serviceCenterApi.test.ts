import { afterEach, describe, expect, it, vi } from "vitest";

import { getTicketDetail } from "@/lib/serviceCenterApi";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("serviceCenterApi getTicketDetail", () => {
  it("normalizes ticket detail payloads without making a real request", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          ticket: {
            id: 42,
            service_type: "stay",
            inquiry_type_code: "booking",
            requester_name: "Hong Gil-dong",
            requester_email: "hong@example.com",
            requester_phone: "01012345678",
            title: "Room inquiry",
            content: "Detail body",
            status: "done",
            created_at: "2026-03-23T00:00:00Z",
          },
        }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await getTicketDetail(42);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/customer-center/support/tickets/42",
      expect.objectContaining({
        credentials: "include",
        headers: expect.objectContaining({
          Accept: "application/json",
        }),
      }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("expected a successful response");
    }

    expect(result.data).toMatchObject({
      id: 42,
      ticketId: 42,
      serviceType: "jeju-stay",
      service: "jeju-stay",
      inquiryType: "booking",
      inquiryTypeCode: "booking",
      requesterName: "Hong Gil-dong",
      requesterEmail: "hong@example.com",
      requesterPhone: "01012345678",
      title: "Room inquiry",
      content: "Detail body",
      status: "done",
    });
  });
});
