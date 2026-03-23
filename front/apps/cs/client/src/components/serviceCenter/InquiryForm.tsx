import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { SERVICE_OPTIONS, INQUIRY_TYPES } from "@/data/inquiryOptions";
import { useAuth } from "@/contexts/AuthContext";
import type { InquirySubmission } from "@/types/service-center";
import "@/styles/inquiry-form.css";

const sanitizeInput = (value: string) => value.replace(/[<>]/g, "");

const inquirySchema = z.object({
  service: z.enum(["jeju-air", "jeju-stay", "jeju-rental", "common"]),
  inquiryType: z.string().min(1, "문의 유형을 선택해 주세요."),
  name: z.string().min(2, "이름은 최소 2글자 이상이어야 합니다.").max(20, "이름은 20자 이내여야 합니다."),
  email: z.string().email("유효한 이메일 주소를 입력해 주세요."),
  phone: z.string().min(10, "연락처를 정확히 입력해 주세요."),
  title: z.string().min(5, "제목은 최소 5자 이상이어야 합니다.").max(100, "제목은 100자 이내여야 합니다."),
  content: z.string().min(10, "상세 내용은 최소 10자 이상 작성해 주세요.").max(5000, "상세 내용은 5,000자 이내여야 합니다."),
  agreement: z.boolean().refine((value) => value === true, "개인정보 수집 및 이용에 동의해야 합니다."),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  onSubmitted?: (inquiry: InquirySubmission) => void;
}

export default function InquiryForm({ onSubmitted }: InquiryFormProps) {
  const { user, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      service: "common",
      inquiryType: "",
      agreement: false,
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      title: "",
      content: "",
    },
    mode: "onChange",
  });

  const selectedService = watch("service");
  const currentInquiryTypes = INQUIRY_TYPES[selectedService];

  useEffect(() => {
    if (user) {
      setValue("name", user.name, { shouldValidate: true });
      setValue("email", user.email, { shouldValidate: true });
      setValue("phone", user.phone, { shouldValidate: true });
      setValue("agreement", true, { shouldValidate: true });
    }
  }, [user, setValue, isAuthenticated]);

  const onSubmit = async (data: InquiryFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const cleanData: InquirySubmission = {
      ...data,
      title: sanitizeInput(data.title),
      content: sanitizeInput(data.content),
      name: sanitizeInput(data.name),
    };

    console.log("Submitting inquiry (Refactored):", cleanData);
    alert("문의사항이 성공적으로 접수되었습니다.");
    onSubmitted?.(cleanData);
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
  };

  return (
    <div className="inquiry-form-container">
      <header className="inquiry-form-header">
        <h2>1:1 문의하기</h2>
        <p>궁금하신 점을 남겨주시면 정성을 다해 답변해 드리겠습니다.</p>
        {isAuthenticated && user ? (
          <div style={{ marginTop: "10px", fontSize: "0.9rem", color: "#ff6000", fontWeight: 700 }}>
            • {user.name}님 계정으로 작성 중입니다.
          </div>
        ) : null}
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="inquiry-form-grid">
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
            <option value="">문의 유형 선택</option>
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
              <input id="name" type="text" placeholder="성함 입력" {...register("name")} />
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
          <input id="title" type="text" placeholder="문의 제목 입력 (최소 5자)" {...register("title")} />
          {errors.title ? <span className="inquiry-error-text">{errors.title.message}</span> : null}
        </div>

        <div className="inquiry-form-group full-width">
          <label htmlFor="content">문의 내용</label>
          <textarea id="content" placeholder="상세 문의 내용을 작성해 주세요. (최대 5,000자)" {...register("content")} />
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
                ? "기존 가입 정보의 개인정보 수집 및 이용에 동의한 것으로 간주하여 문의를 진행합니다."
                : "회원님은 개인정보 수집 및 이용에 거부할 권리가 있으나, 거부 시 이용이 제한될 수 있습니다."}
            </div>
            <label className="inquiry-checkbox-group">
              <input type="checkbox" {...register("agreement")} />
              <span>개인정보 수집 및 이용에 동의합니다. (필수)</span>
            </label>
            {errors.agreement ? <span className="inquiry-error-text">{errors.agreement.message}</span> : null}
          </div>
        </div>

        <div className="inquiry-form-group full-width">
          <button type="submit" className="inquiry-submit-btn" disabled={isSubmitting || !isValid}>
            {isSubmitting ? "접수 중..." : "1:1 문의 제출하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
