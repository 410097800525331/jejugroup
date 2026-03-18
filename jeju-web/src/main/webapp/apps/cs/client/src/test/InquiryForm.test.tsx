import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import InquiryForm from "../components/serviceCenter/InquiryForm";
import { AuthProvider } from "../contexts/AuthContext";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("InquiryForm Validation", () => {
  it("shows error messages when submitting an empty form", async () => {
    render(<InquiryForm />, { wrapper: Wrapper });
    
    const submitButton = screen.getByRole("button", { name: /제출하기/i });
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button only when all fields are valid", async () => {
    render(<InquiryForm />, { wrapper: Wrapper });
    
    // 비로그인 상태이므로 모든 필드를 채워야 함
    const nameInput = screen.getByLabelText(/이름/i);
    const phoneInput = screen.getByLabelText(/연락처/i);
    const emailInput = screen.getByLabelText(/이메일/i);
    const titleInput = screen.getByLabelText(/제목/i);
    const contentInput = screen.getByLabelText(/문의 내용/i);
    const agreementCheckbox = screen.getByLabelText(/동의합니다/i);
    const submitButton = screen.getByRole("button", { name: /제출하기/i });
    const typeSelect = screen.getByLabelText(/문의 유형/i);

    expect(submitButton).toBeDisabled();

    // Fill the form
    fireEvent.change(nameInput, { target: { value: "홍길동" } });
    fireEvent.change(phoneInput, { target: { value: "01012345678" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    
    // 기본 서비스가 'common'이므로 'general' 유형 선택
    fireEvent.change(typeSelect, { target: { value: "general" } });
    
    fireEvent.change(titleInput, { target: { value: "문의드립니다 제목입니다." } });
    fireEvent.change(contentInput, { target: { value: "상세 내용입니다. 10자 이상 작성합니다. 만족스럽네요." } });
    fireEvent.click(agreementCheckbox);

    // Wait for the form to update validation state
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("shows error for invalid email", async () => {
    render(<InquiryForm />, { wrapper: Wrapper });
    
    const emailInput = screen.getByLabelText(/이메일/i);
    
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/유효한 이메일 주소를 입력해 주세요/i)).toBeInTheDocument();
    });
  });
});
