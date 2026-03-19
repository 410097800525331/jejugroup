import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import InquiryForm from "../components/serviceCenter/InquiryForm";
import { AuthProvider } from "../contexts/AuthContext";

const Wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

describe("InquiryForm Validation", () => {
  it("disables submit button when the form is empty", () => {
    render(<InquiryForm />, { wrapper: Wrapper });

    const submitButton = screen.getByRole("button", { name: /1:1 문의 제출하기/i });
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when all required fields are valid", async () => {
    render(<InquiryForm />, { wrapper: Wrapper });

    const nameInput = screen.getByLabelText(/이름/i);
    const phoneInput = screen.getByLabelText(/연락처/i);
    const emailInput = screen.getByLabelText(/이메일/i);
    const titleInput = screen.getByLabelText(/제목/i);
    const contentInput = screen.getByLabelText(/문의 내용/i);
    const agreementCheckbox = screen.getByLabelText(/개인정보 수집 및 이용에 동의합니다/i);
    const submitButton = screen.getByRole("button", { name: /1:1 문의 제출하기/i });
    const typeSelect = screen.getByLabelText(/문의 유형/i);

    expect(submitButton).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: "홍길동" } });
    fireEvent.change(phoneInput, { target: { value: "01012345678" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(typeSelect, { target: { value: "general" } });
    fireEvent.change(titleInput, { target: { value: "문의드립니다 제목입니다" } });
    fireEvent.change(contentInput, { target: { value: "상세 문의 내용입니다. 충분한 길이로 작성했습니다." } });
    fireEvent.click(agreementCheckbox);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("shows an error for invalid email", async () => {
    render(<InquiryForm />, { wrapper: Wrapper });

    const emailInput = screen.getByLabelText(/이메일/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/유효한 이메일 주소를 입력해 주세요/i)).toBeInTheDocument();
    });
  });
});
