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
  "h-8 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-[var(--color-teal)] placeholder:text-muted-foreground";

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

  const handleDateChange = (
    key: string,
    part: "from" | "to",
    value: string
  ) => {
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
        if (value) {
          result.push({ field: field.key, operator: "contains", Value: value });
        }
      } else if (field.type === "select") {
        const value = typeof raw === "string" ? raw : "";
        if (value) {
          result.push({ field: field.key, operator: "equals", Value: value });
        }
      } else if (field.type === "dateRange") {
        const range =
          raw !== undefined && typeof raw === "object" ? raw : {};
        if (range.from) {
          result.push({ field: field.key, operator: "gt", Value: range.from });
        }
        if (range.to) {
          result.push({ field: field.key, operator: "lt", Value: range.to });
        }
      }
    }

    return result;
  };

  const handleApply = () => {
    onApply(buildFilters());
  };

  const handleReset = () => {
    setDraft({});
    onReset();
  };

  return (
    <div className="flex flex-wrap items-end gap-3 p-3 rounded-lg border bg-[var(--color-teal-soft,#f0fafb)]">
      {fields.map((field) => {
        if (field.type === "text") {
          return (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground">
                {field.label}
              </label>
              <input
                type="text"
                className={INPUT_CLASS}
                placeholder={field.placeholder ?? ""}
                value={typeof draft[field.key] === "string" ? (draft[field.key] as string) : ""}
                onChange={(e) => handleTextChange(field.key, e.target.value)}
              />
            </div>
          );
        }

        if (field.type === "select") {
          return (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground">
                {field.label}
              </label>
              <select
                className={INPUT_CLASS}
                value={typeof draft[field.key] === "string" ? (draft[field.key] as string) : ""}
                onChange={(e) => handleSelectChange(field.key, e.target.value)}
              >
                <option value="">Todos</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === "dateRange") {
          const rangeVal = draft[field.key];
          const range =
            rangeVal !== undefined && typeof rangeVal === "object" ? rangeVal : {};
          return (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground">
                {field.label}
              </label>
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-muted-foreground">Desde</span>
                  <input
                    type="date"
                    className={INPUT_CLASS}
                    value={range.from ?? ""}
                    onChange={(e) =>
                      handleDateChange(field.key, "from", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-muted-foreground">Hasta</span>
                  <input
                    type="date"
                    className={INPUT_CLASS}
                    value={range.to ?? ""}
                    onChange={(e) =>
                      handleDateChange(field.key, "to", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          );
        }

        return null;
      })}

      {/* Action buttons */}
      <div className="flex items-end gap-2 ml-auto">
        {activeFilterCount !== undefined && activeFilterCount > 0 && (
          <span className="text-xs text-muted-foreground self-center">
            {activeFilterCount} activo{activeFilterCount !== 1 ? "s" : ""}
          </span>
        )}
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Limpiar
        </Button>
        <Button
          size="sm"
          className="bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal-dark)]"
          onClick={handleApply}
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
};
