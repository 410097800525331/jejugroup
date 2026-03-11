import type { FeedbackTone } from "@front-components/auth/state/types";

interface StatusMessageProps {
  className?: string;
  id?: string;
  message: string;
  tone?: FeedbackTone;
}

const getToneClassName = (tone: FeedbackTone) => {
  if (tone === "success") {
    return "success";
  }

  if (tone === "warning") {
    return "warning";
  }

  if (tone === "error") {
    return "error";
  }

  return "";
};

export const StatusMessage = ({ className = "", id, message, tone = "idle" }: StatusMessageProps) => {
  if (!message) {
    return null;
  }

  const toneClassName = getToneClassName(tone);
  const resolvedClassName = ["input-feedback", toneClassName, className].filter(Boolean).join(" ");

  return (
    <p className={resolvedClassName} id={id}>
      {message}
    </p>
  );
};
