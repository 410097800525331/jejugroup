import type { ServiceType } from "@/types/service-center";

export const SERVICE_OPTIONS = [
  { value: "jeju-air", label: "제주항공" },
  { value: "jeju-stay", label: "제주스테이" },
  { value: "jeju-rental", label: "제주렌터카" },
] satisfies Array<{ value: ServiceType; label: string }>;
