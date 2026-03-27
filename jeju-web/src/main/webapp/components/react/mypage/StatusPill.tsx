interface StatusPillProps {
  tone: "air" | "rent" | "stay" | "wallet" | "coupon" | "point" | "voucher";
  value: string;
}

const toneClassMap: Record<StatusPillProps["tone"], string> = {
  air: "brand-air",
  coupon: "brand-coupon",
  point: "brand-point",
  rent: "brand-rent",
  stay: "brand-stay",
  voucher: "brand-voucher",
  wallet: "",
};



export const StatusPill = ({ tone, value }: StatusPillProps) => {
  const toneClass = toneClassMap[tone];
  return <span className={`pill-shape ${toneClass}`.trim()}>{value}</span>;
};

