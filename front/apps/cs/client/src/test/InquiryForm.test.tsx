import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import InquiryForm from "../components/serviceCenter/InquiryForm";

describe("InquiryForm Validation", () => {
  it("disables submit button when the form is empty", () => {
    render(<InquiryForm />);

    const submitButton = screen.getByRole("button", { name: /1:1 문의 제출하기/i });
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when all required fields are valid", async () => {
    render(<InquiryForm />);

    const serviceSelect = screen.getByLabelText(/서비스 선택/i);
    const titleInput = screen.getByLabelText(/제목/i);
    const contentInput = screen.getByLabelText(/문의 내용/i);
    const submitButton = screen.getByRole("button", { name: /1:1 문의 제출하기/i });

    expect(submitButton).toBeDisabled();

    fireEvent.change(serviceSelect, { target: { value: "jeju-stay" } });
    fireEvent.change(titleInput, { target: { value: "문의드립니다 제목입니다" } });
    fireEvent.change(contentInput, { target: { value: "상세 문의 내용입니다. 충분한 길이로 작성했습니다." } });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("shows an error for too-short content", async () => {
    render(<InquiryForm />);

    const contentInput = screen.getByLabelText(/문의 내용/i);
    fireEvent.change(contentInput, { target: { value: "짧음" } });
    fireEvent.blur(contentInput);

    await waitFor(() => {
      expect(screen.getByText(/상세 내용을 최소 10자 이상 작성해 주세요/i)).toBeInTheDocument();
    });
  });
});
