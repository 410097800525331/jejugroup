import { render, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import InquiryForm from "../components/serviceCenter/InquiryForm";

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  createTicket: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: mocks.useAuth,
}));

vi.mock("@/lib/serviceCenterApi", () => ({
  createTicket: mocks.createTicket,
}));

describe("InquiryForm", () => {
  beforeEach(() => {
    mocks.useAuth.mockReset();
    mocks.createTicket.mockReset();
  });

  it("disables inquiry submission for logged-out users", () => {
    mocks.useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      sessionState: "success",
      sessionError: null,
    });

    const { container } = render(<InquiryForm />);

    const submitButton = container.querySelector(".inquiry-submit-btn") as HTMLButtonElement | null;
    const serviceSelect = container.querySelector("#service") as HTMLSelectElement | null;
    const inquiryTypeSelect = container.querySelector("#inquiryType") as HTMLSelectElement | null;

    expect(submitButton).not.toBeNull();
    expect(serviceSelect).not.toBeNull();
    expect(inquiryTypeSelect).not.toBeNull();
    expect(submitButton).toBeDisabled();
    expect(serviceSelect).toBeDisabled();
    expect(inquiryTypeSelect).toBeDisabled();
    expect(mocks.createTicket).not.toHaveBeenCalled();
  });

  it("submits through the API when the user is logged in", async () => {
    mocks.useAuth.mockReturnValue({
      user: {
        id: "user-1",
        name: "Hong Gil-dong",
        email: "hong@example.com",
        phone: "01012345678",
      },
      isAuthenticated: true,
      sessionState: "success",
      sessionError: null,
    });
    mocks.createTicket.mockResolvedValue({
      ok: true,
      status: 201,
      data: null,
      error: null,
    });

    const onSubmitted = vi.fn();
    const { container } = render(<InquiryForm onSubmitted={onSubmitted} />);

    const inquiryTypeSelect = container.querySelector("#inquiryType") as HTMLSelectElement | null;
    const titleInput = container.querySelector("#title") as HTMLInputElement | null;
    const contentInput = container.querySelector("#content") as HTMLTextAreaElement | null;
    const agreementCheckbox = container.querySelector('input[name="agreement"]') as HTMLInputElement | null;
    const form = container.querySelector("form");

    expect(inquiryTypeSelect).not.toBeNull();
    expect(titleInput).not.toBeNull();
    expect(contentInput).not.toBeNull();
    expect(agreementCheckbox).not.toBeNull();
    expect(form).not.toBeNull();

    fireEvent.change(inquiryTypeSelect!, { target: { value: "general" } });
    fireEvent.change(titleInput!, { target: { value: "Inquiry form regression" } });
    fireEvent.change(contentInput!, { target: { value: "This is a valid content body for submission." } });

    if (!agreementCheckbox!.checked) {
      fireEvent.click(agreementCheckbox!);
    }

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mocks.createTicket).toHaveBeenCalledTimes(1);
    });

    expect(mocks.createTicket).toHaveBeenCalledWith({
      serviceType: "common",
      inquiryType: "general",
      title: "Inquiry form regression",
      content: "This is a valid content body for submission.",
      name: "Hong Gil-dong",
      email: "hong@example.com",
      phone: "01012345678",
      agreement: true,
    });
    expect(onSubmitted).toHaveBeenCalledTimes(1);
  });

  it("clears stale inquiryType values when the service changes", async () => {
    mocks.useAuth.mockReturnValue({
      user: {
        id: "user-1",
        name: "Hong Gil-dong",
        email: "hong@example.com",
        phone: "01012345678",
      },
      isAuthenticated: true,
      sessionState: "success",
      sessionError: null,
    });
    mocks.createTicket.mockResolvedValue({
      ok: true,
      status: 201,
      data: null,
      error: null,
    });

    const { container } = render(<InquiryForm />);

    const serviceSelect = container.querySelector("#service") as HTMLSelectElement | null;
    const inquiryTypeSelect = container.querySelector("#inquiryType") as HTMLSelectElement | null;
    const titleInput = container.querySelector("#title") as HTMLInputElement | null;
    const contentInput = container.querySelector("#content") as HTMLTextAreaElement | null;
    const agreementCheckbox = container.querySelector('input[name="agreement"]') as HTMLInputElement | null;
    const submitButton = container.querySelector(".inquiry-submit-btn") as HTMLButtonElement | null;
    const form = container.querySelector("form");

    expect(serviceSelect).not.toBeNull();
    expect(inquiryTypeSelect).not.toBeNull();
    expect(titleInput).not.toBeNull();
    expect(contentInput).not.toBeNull();
    expect(agreementCheckbox).not.toBeNull();
    expect(submitButton).not.toBeNull();
    expect(form).not.toBeNull();

    fireEvent.change(inquiryTypeSelect!, { target: { value: "general" } });
    fireEvent.change(titleInput!, { target: { value: "Service sync regression" } });
    fireEvent.change(contentInput!, { target: { value: "This content is long enough to validate the form." } });

    if (!agreementCheckbox!.checked) {
      fireEvent.click(agreementCheckbox!);
    }

    await waitFor(() => {
      expect(submitButton!).not.toBeDisabled();
    });

    fireEvent.change(serviceSelect!, { target: { value: "jeju-air" } });

    await waitFor(() => {
      expect(inquiryTypeSelect!.value).toBe("");
    });

    expect(submitButton!).toBeDisabled();

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mocks.createTicket).not.toHaveBeenCalled();
    });
  });
});
