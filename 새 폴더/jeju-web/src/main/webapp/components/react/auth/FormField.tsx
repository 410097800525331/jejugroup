import type { ChangeEventHandler, HTMLAttributes, HTMLInputTypeAttribute, ReactNode } from "react";
import { StatusMessage } from "@front-components/auth/StatusMessage";
import type { FeedbackTone } from "@front-components/auth/state/types";

interface FormFieldProps {
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
  feedback?: string;
  feedbackTone?: FeedbackTone;
  id: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  label: string;
  maxLength?: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  readOnly?: boolean;
  rightSlot?: ReactNode;
  type?: HTMLInputTypeAttribute;
  value: string;
}

export const FormField = ({
  autoComplete,
  className,
  disabled,
  feedback,
  feedbackTone = "idle",
  id,
  inputMode,
  label,
  maxLength,
  onChange,
  placeholder,
  readOnly,
  rightSlot,
  type = "text",
  value,
}: FormFieldProps) => {
  const inputElement = (
    <input
      autoComplete={autoComplete}
      disabled={disabled}
      id={id}
      inputMode={inputMode}
      maxLength={maxLength}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      type={type}
      value={value}
    />
  );

  return (
    <div className={["input_group", className].filter(Boolean).join(" ")}>
      <label htmlFor={id}>{label}</label>
      {rightSlot ? <div className="input-with-button">{inputElement}{rightSlot}</div> : inputElement}
      {feedback ? <StatusMessage message={feedback} tone={feedbackTone} /> : null}
    </div>
  );
};
