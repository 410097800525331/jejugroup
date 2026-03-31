import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { useAuth } from "@/contexts/AuthContext";
import { SERVICE_OPTIONS, INQUIRY_TYPES } from "@/data/inquiryOptions";
import { createTicket } from "@/lib/serviceCenterApi";
import type { InquirySubmission } from "@/types/service-center";
import "@/styles/inquiry-form.css";

const sanitizeInput = (value: string) => value.replace(/[<>]/g, "");

const inquirySchema = z
  .object({
    service: z.enum(["jeju-air", "jeju-stay", "jeju-rental", "common"]),
    inquiryType: z.string().min(1, "문의 유형을 선택해 주세요."),
    name: z.string().min(2, "이름은 최소 2글자 이상이어야 합니다.").max(20, "이름은 20자 이내여야 합니다."),
    email: z.string().email("유효한 이메일 주소를 입력해 주세요."),
    phone: z.string().min(10, "연락처를 올바르게 입력해 주세요."),
    title: z.string().min(5, "제목은 최소 5자 이상이어야 합니다.").max(100, "제목은 100자 이내여야 합니다."),
    content: z.string().min(10, "문의 내용은 최소 10자 이상 작성해 주세요.").max(5000, "문의 내용은 5,000자 이내여야 합니다."),
    agreement: z.boolean().refine((value) => value === true, "개인정보 수집 및 이용에 동의해 주세요."),
  })
  .superRefine((data, ctx) => {
    const allowedInquiryTypes = INQUIRY_TYPES[data.service] ?? [];
    const isAllowedInquiryType = allowedInquiryTypes.some((option) => option.value === data.inquiryType);

    if (data.inquiryType && !isAllowedInquiryType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["inquiryType"],
        message: "현재 선택하신 서비스와 맞지 않는 문의 유형입니다. 다시 선택해 주세요.",
      });
    }
  });

type InquiryFormValues = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  onSubmitted?: () => void | Promise<void>;
}

export default function InquiryForm({ onSubmitted }: InquiryFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultValues = useMemo(
    () => ({
      service: "common" as const,
      inquiryType: "",
      agreement: isAuthenticated,
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      title: "",
      content: "",
    }),
    [isAuthenticated, user?.email, user?.name, user?.phone],
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues,
    mode: "onChange",
  });

  const selectedService = watch("service");
  const selectedInquiryType = watch("inquiryType");
  const currentInquiryTypes = INQUIRY_TYPES[selectedService];

  useEffect(() => {
    reset(defaultValues);
    setSubmitError(null);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!selectedInquiryType) {
      return;
    }

    const isCurrentInquiryTypeAllowed = currentInquiryTypes.some((option) => option.value === selectedInquiryType);

    if (!isCurrentInquiryTypeAllowed) {
      setValue("inquiryType", "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [currentInquiryTypes, selectedInquiryType, setValue]);

  const onSubmit = async (data: InquiryFormValues) => {
    setSubmitError(null);

    if (!isAuthenticated) {
      setSubmitError("로그인이 필요하여 문의를 등록할 수 없습니다.");
      return;
    }

    try {
      const cleanData: InquirySubmission = {
        ...data,
        title: sanitizeInput(data.title),
        content: sanitizeInput(data.content),
        name: sanitizeInput(data.name ?? ""),
      };

      const response = await createTicket({
        serviceType: cleanData.service,
        inquiryType: cleanData.inquiryType,
        title: cleanData.title,
        content: cleanData.content,
        name: cleanData.name,
        email: cleanData.email,
        phone: cleanData.phone,
        agreement: cleanData.agreement,
      });

      if (!response.ok) {
        throw response.error;
      }

      reset({
        service: "common",
        inquiryType: "",
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        title: "",
        content: "",
        agreement: !!user,
      });
      void onSubmitted?.();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "문의 작성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className="inquiry-form-container">
      <header className="inquiry-form-header">
        <h2>1:1 문의하기</h2>
        <p>문의 내용을 입력해 주시면 담당자가 확인 후 답변을 남겨 드립니다.</p>
        {isAuthenticated && user ? (
          <div style={{ marginTop: "10px", fontSize: "0.9rem", color: "#ff6000", fontWeight: 700 }}>
            {user.name} 계정으로 작성 중입니다.
          </div>
        ) : (
          <div style={{ marginTop: "10px", fontSize: "0.9rem", color: "#b45309", fontWeight: 700 }}>
            로그인하지 않아도 문의 작성은 가능합니다.
          </div>
        )}
        {submitError ? (
          <div
            style={{
              marginTop: "12px",
              padding: "12px 14px",
              borderRadius: "12px",
              background: "#fef2f2",
              color: "#b91c1c",
              fontSize: "0.92rem",
              fontWeight: 700,
            }}
          >
            {submitError}
          </div>
        ) : null}
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="inquiry-form-grid">
        <fieldset disabled={!isAuthenticated || isSubmitting} style={{ border: 0, padding: 0, margin: 0, display: "contents" }}>
          <div className="inquiry-form-group">
            <label htmlFor="service">서비스 선택</label>
            <select id="service" {...register("service")}>
              {SERVICE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.service ? <span className="inquiry-error-text">{errors.service.message}</span> : null}
          </div>

          <div className="inquiry-form-group">
            <label htmlFor="inquiryType">문의 유형</label>
            <select id="inquiryType" {...register("inquiryType")}>
              <option value="">문의 유형을 선택해 주세요</option>
              {currentInquiryTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.inquiryType ? <span className="inquiry-error-text">{errors.inquiryType.message}</span> : null}
          </div>

          {!isAuthenticated ? (
            <>
              <div className="inquiry-form-group">
                <label htmlFor="name">이름</label>
                <input id="name" type="text" placeholder="이름을 입력해 주세요" {...register("name")} />
                {errors.name ? <span className="inquiry-error-text">{errors.name.message}</span> : null}
              </div>

              <div className="inquiry-form-group">
                <label htmlFor="phone">연락처</label>
                <input id="phone" type="tel" placeholder="010-0000-0000" {...register("phone")} />
                {errors.phone ? <span className="inquiry-error-text">{errors.phone.message}</span> : null}
              </div>

              <div className="inquiry-form-group full-width">
                <label htmlFor="email">이메일</label>
                <input id="email" type="email" placeholder="example@jejuair.com" {...register("email")} />
                {errors.email ? <span className="inquiry-error-text">{errors.email.message}</span> : null}
              </div>
            </>
          ) : null}

          <div className="inquiry-form-group full-width">
            <label htmlFor="title">제목</label>
            <input id="title" type="text" placeholder="문의 제목을 입력해 주세요 (최소 5자)" {...register("title")} />
            {errors.title ? <span className="inquiry-error-text">{errors.title.message}</span> : null}
          </div>

          <div className="inquiry-form-group full-width">
            <label htmlFor="content">문의 내용</label>
            <textarea id="content" placeholder="문의 내용을 자세히 작성해 주세요 (최대 5,000자)" {...register("content")} />
            {errors.content ? <span className="inquiry-error-text">{errors.content.message}</span> : null}
          </div>

          <div className="inquiry-form-group full-width">
            <div className="inquiry-agreement">
              <div className="inquiry-agreement-content">
                [개인정보 수집 및 이용 동의]
                <br />
                <br />
                1. 수집하는 개인정보 항목: 이름, 이메일, 연락처
                <br />
                2. 수집 및 이용 목적: 1:1 문의 접수 및 답변 처리
                <br />
                3. 보유 및 이용 기간: 답변 완료 후 3년 보관
                <br />
                <br />
                {isAuthenticated
                  ? "기존 회원 정보가 있는 경우 개인정보 수집 및 이용에 동의하신 것으로 간주하여 문의를 진행합니다."
                  : "회원이 아닌 경우 개인정보 수집 및 이용에 대한 동의가 필요합니다. 내용 확인 목적으로만 사용합니다."}
              </div>
              <label className="inquiry-checkbox-group">
                <input type="checkbox" {...register("agreement")} />
                <span>개인정보 수집 및 이용에 동의합니다. (필수)</span>
              </label>
              {errors.agreement ? <span className="inquiry-error-text">{errors.agreement.message}</span> : null}
            </div>
          </div>
        </fieldset>

        <div className="inquiry-form-group full-width">
          <button type="submit" className="inquiry-submit-btn" disabled={!isAuthenticated || isSubmitting || !isValid}>
            {isSubmitting ? "작성 중..." : isAuthenticated ? "1:1 문의 등록" : "로그인이 필요합니다"}
          </button>
        </div>
      </form>
    </div>
  );
}
