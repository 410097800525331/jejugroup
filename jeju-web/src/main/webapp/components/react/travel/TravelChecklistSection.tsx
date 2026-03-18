import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, Check, FileText, HeartPulse, Smartphone } from "lucide-react";
import type { TravelChecklistSection as TravelChecklistSectionType } from "@front-components/travel/travelChecklistData";

const ICON_MAP: Record<TravelChecklistSectionType["icon"], LucideIcon> = {
  document: FileText,
  device: Smartphone,
  health: HeartPulse,
  luggage: BriefcaseBusiness,
};

interface TravelChecklistSectionProps {
  checkedIds: ReadonlySet<string>;
  onToggle: (itemId: string) => void;
  section: TravelChecklistSectionType;
}

export const TravelChecklistSection = ({ checkedIds, onToggle, section }: TravelChecklistSectionProps) => {
  const SectionIcon = ICON_MAP[section.icon];

  return (
    <section className="travel-checklist-section-card">
      <header className="travel-checklist-section-head">
        <div className="travel-checklist-section-icon">
          <SectionIcon size={20} strokeWidth={2.25} />
        </div>
        <div>
          <h2 className="travel-checklist-section-title">{section.title}</h2>
          <p className="travel-checklist-section-desc">{section.description}</p>
        </div>
      </header>

      <div className="travel-checklist-items">
        {section.items.map((item) => {
          const isChecked = checkedIds.has(item.id);

          return (
            <button
              aria-pressed={isChecked}
              className={`travel-checklist-item${isChecked ? " is-checked" : ""}`}
              key={item.id}
              onClick={() => onToggle(item.id)}
              type="button"
            >
              <span className="travel-checklist-item-check">
                {isChecked ? <Check size={16} strokeWidth={3} /> : null}
              </span>
              <span className="travel-checklist-item-copy">
                <strong>{item.label}</strong>
                {item.note ? <small>{item.note}</small> : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
