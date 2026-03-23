import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { FilterDto } from "@/shared/aplication/dtos/filter.dto";
import type { FilterFieldConfig, FilterPanelState } from "./filter-field.types";

interface FilterPanelProps {
  fields: FilterFieldConfig[];
  onApply: (filters: FilterDto[]) => void;
  onReset: () => void;
  activeFilterCount?: number;
}

const INPUT_CLASS =
  "h-9 rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors " +
  "focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/15 " +
  "placeholder:text-muted-foreground/50 " +
  "border-border/60 hover:border-border";

const LABEL_CLASS =
  "text-[10px] font-semibold uppercase tracking-widest select-none " +
  "text-[var(--color-teal-dark,#0d9488)]";

export const FilterPanel = ({
  fields,
  onApply,
  onReset,
  activeFilterCount,
}: FilterPanelProps) => {
  const [draft, setDraft] = useState<FilterPanelState>({});

  const handleTextChange = (key: string, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (key: string, part: "from" | "to", value: string) => {
    setDraft((prev) => {
      const existing = prev[key];
      const current =
        existing !== undefined && typeof existing === "object" ? existing : {};
      return { ...prev, [key]: { ...current, [part]: value } };
    });
  };

  const buildFilters = (): FilterDto[] => {
    const result: FilterDto[] = [];
    for (const field of fields) {
      const raw = draft[field.key];
      if (field.type === "text") {
        const value = typeof raw === "string" ? raw.trim() : "";
        if (value) result.push({ field: field.key, operator: "contains", Value: value });
      } else if (field.type === "select") {
        const value = typeof raw === "string" ? raw : "";
        if (value) result.push({ field: field.key, operator: "equals", Value: value });
      } else if (field.type === "dateRange") {
        const range = raw !== undefined && typeof raw === "object" ? raw : {};
        if (range.from) result.push({ field: field.key, operator: "gt", Value: range.from });
        if (range.to) result.push({ field: field.key, operator: "lt", Value: range.to });
      }
    }
    return result;
  };

  const handleApply = () => onApply(buildFilters());

  const handleReset = () => {
    setDraft({});
    onReset();
  };

  return (
    <div
      className="rounded-xl border px-4 py-3.5"
      style={{
        backgroundColor: "var(--color-white, #fff)",
        borderColor: "rgba(0,0,0,0.07)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)",
      }}
    >
      <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
        {fields.map((field) => {
          /* ── Text input ── */
          if (field.type === "text") {
            return (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label className={LABEL_CLASS}>{field.label}</label>
                <input
                  type="text"
                  className={`${INPUT_CLASS} min-w-[160px]`}
                  placeholder={field.placeholder ?? ""}
                  value={
                    typeof draft[field.key] === "string"
                      ? (draft[field.key] as string)
                      : ""
                  }
                  onChange={(e) => handleTextChange(field.key, e.target.value)}
                />
              </div>
            );
          }

          /* ── Select → pill group ── */
          if (field.type === "select") {
            const current =
              typeof draft[field.key] === "string"
                ? (draft[field.key] as string)
                : "";
            return (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label className={LABEL_CLASS}>{field.label}</label>
                <div className="flex items-center gap-1 h-9">
                  <PillButton
                    active={current === ""}
                    onClick={() => handleSelectChange(field.key, "")}
                  >
                    Todos
                  </PillButton>
                  {field.options?.map((opt) => (
                    <PillButton
                      key={opt.value}
                      active={current === opt.value}
                      onClick={() => handleSelectChange(field.key, opt.value)}
                    >
                      {opt.label}
                    </PillButton>
                  ))}
                </div>
              </div>
            );
          }

          /* ── Date range ── */
          if (field.type === "dateRange") {
            const rangeVal = draft[field.key];
            const range =
              rangeVal !== undefined && typeof rangeVal === "object"
                ? rangeVal
                : {};
            return (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label className={LABEL_CLASS}>{field.label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className={`${INPUT_CLASS} w-[148px]`}
                    title="Desde"
                    value={range.from ?? ""}
                    onChange={(e) =>
                      handleDateChange(field.key, "from", e.target.value)
                    }
                  />
                  <span
                    className="text-muted-foreground/50 text-xs font-light shrink-0"
                    aria-hidden
                  >
                    —
                  </span>
                  <input
                    type="date"
                    className={`${INPUT_CLASS} w-[148px]`}
                    title="Hasta"
                    value={range.to ?? ""}
                    onChange={(e) =>
                      handleDateChange(field.key, "to", e.target.value)
                    }
                  />
                </div>
              </div>
            );
          }

          return null;
        })}

        {/* ── Actions ── */}
        <div className="flex items-center gap-2 ml-auto self-end pb-[2px]">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded"
          >
            Limpiar
          </button>
          <Button
            size="sm"
            onClick={handleApply}
            className="gap-1.5 bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal-dark)] h-8 px-4 text-xs font-medium"
          >
            Aplicar
            {activeFilterCount !== undefined && activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-white/25 text-[10px] font-bold leading-none">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ── Pill toggle button ── */
interface PillButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const PillButton = ({ active, onClick, children }: PillButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "px-3 h-7 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap",
      active
        ? "bg-[var(--color-teal)] text-white shadow-sm"
        : "border border-border/70 text-muted-foreground bg-background",
      !active && "hover:border-[var(--color-teal)]/60 hover:text-[var(--color-teal)]",
    ]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
  </button>
);
