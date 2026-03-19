import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { SERVICE_OPTIONS } from "@/data/inquiryOptions";
import type { InquirySubmission } from "@/types/service-center";
import "@/styles/inquiry-form.css";

const sanitizeInput = (value: string) => value.replace(/[<>]/g, "");

const inquirySchema = z.object({
  service: z.enum(["jeju-air", "jeju-stay", "jeju-rental"]),
  title: z.string().min(5, "제목은 최소 5자 이상이어야 합니다.").max(100, "제목은 100자 이하여야 합니다."),
  content: z.string().min(10, "상세 내용을 최소 10자 이상 작성해 주세요.").max(5000, "상세 내용은 5,000자 이하여야 합니다."),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  description?: string;
  initialValues?: Partial<InquirySubmission>;
  onCancel?: () => void;
  onSubmitted?: (inquiry: InquirySubmission) => Promise<void> | void;
  submitLabel?: string;
  title?: string;
}

const getDefaultValues = (initialValues?: Partial<InquirySubmission>): InquiryFormValues => ({
  service: initialValues?.service ?? "jeju-air",
  title: initialValues?.title ?? "",
  content: initialValues?.content ?? "",
});

export default function InquiryForm({
  description = "문의하실 서비스를 선택하고 제목과 내용을 남겨 주세요.",
  initialValues,
  onCancel,
  onSubmitted,
  submitLabel = "1:1 문의 제출하기",
  title = "1:1 문의하기",
}: InquiryFormProps) {
  const isEditMode = Boolean(initialValues);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: getDefaultValues(initialValues),
    mode: "onChange",
  });

  useEffect(() => {
    reset(getDefaultValues(initialValues));
  }, [initialValues, reset]);

  const onSubmit = async (data: InquiryFormValues) => {
    const cleanData: InquirySubmission = {
      ...data,
      title: sanitizeInput(data.title),
      content: sanitizeInput(data.content),
    };

    try {
      await onSubmitted?.(cleanData);
      alert(isEditMode ? "문의가 수정되었습니다." : "문의가 정상적으로 접수되었습니다.");

      if (!isEditMode) {
        reset(getDefaultValues());
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "문의 처리에 실패했습니다.";
      alert(message);
    }
  };

  return (
    <div className="inquiry-form-container">
      <header className="inquiry-form-header">
        <h2>{title}</h2>
        <p>{description}</p>
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
          <div className="inquiry-form-actions">
            {onCancel ? (
              <button type="button" className="inquiry-cancel-btn" onClick={onCancel}>
                목록
              </button>
            ) : null}
            <button type="submit" className="inquiry-submit-btn" disabled={isSubmitting || !isValid}>
              {isSubmitting ? "처리 중..." : submitLabel}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
