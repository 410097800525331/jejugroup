interface StatusPillProps {
  tone: "air" | "rent" | "stay" | "wallet";
  value: string;
}

const toneClassMap: Record<StatusPillProps["tone"], string> = {
  air: "brand-air",
  rent: "brand-rent",
  stay: "brand-stay",
  wallet: "",
};

export const StatusPill = ({ tone, value }: StatusPillProps) => {
  const toneClass = toneClassMap[tone];
  return <span className={`pill-shape ${toneClass}`.trim()}>{value}</span>;
};

