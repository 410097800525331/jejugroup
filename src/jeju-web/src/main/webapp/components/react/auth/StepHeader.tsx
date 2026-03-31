import { useMemo } from "react";

interface StepItem {
  iconClassName?: string;
  label: string;
}

interface StepHeaderProps {
  accent?: "orange" | "red";
  currentStep: number;
  description?: string;
  steps: readonly StepItem[];
  title: string;
}

export const StepHeader = ({ accent = "orange", currentStep, description, steps, title }: StepHeaderProps) => {
  const progressWidth = useMemo(() => {
    if (steps.length <= 1) {
      return "0%";
    }

    return `${((currentStep - 1) / (steps.length - 1)) * 100}%`;
  }, [currentStep, steps.length]);

  return (
    <header className={`step-header ${accent === "red" ? "step-header-pass" : ""}`}>
      <div className="step-header-text">
        <h1 className="step-title">{title}</h1>
        {description ? <p className="step-desc">{description}</p> : null}
      </div>

      <div className="step-indicator" data-accent={accent}>
        <div className="progress-bg"></div>
        <div className="progress-bar" style={{ width: progressWidth }}></div>
        <div className="step-circles">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const stateClassName = stepNumber === currentStep ? "active" : stepNumber < currentStep ? "completed" : "";

            return (
              <div
                aria-label={`${stepNumber}단계 ${step.label}`}
                className={`step-circle ${stateClassName}`.trim()}
                key={step.label}
              >
                {stepNumber === currentStep && step.iconClassName ? <i className={step.iconClassName}></i> : null}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};
