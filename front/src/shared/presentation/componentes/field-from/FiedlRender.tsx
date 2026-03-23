import type { FormFieldConfig } from "@/shared/domain/base/form-config.types";
import type { Control, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const FieldRenderer = ({
  fieldConfig,
  control,
  isLoading,
}: {
  fieldConfig: FormFieldConfig;
  control: Control<FieldValues>;
  isLoading?: boolean;
}) => {
  return (
    <div className={cn(fieldConfig.colSpan === 1 ? "col-span-1" : "col-span-2")}>
    <FormField
      key={fieldConfig.name}
      control={control}
      name={fieldConfig.name}
      render={({ field }) => (
        <FormItem>
          {fieldConfig.type !== "boolean" && (
            <FormLabel className="text-xs font-medium text-muted-foreground">
              {fieldConfig.label}
              {fieldConfig.required && (
                <span className="text-destructive ml-0.5">*</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            {fieldConfig.type === "text" ||
            fieldConfig.type === "password" ||
            fieldConfig.type === "date" ||
            fieldConfig.type === "uuid" ? (
              <Input
                placeholder={fieldConfig.placeholder ?? ""}
                type={
                  fieldConfig.type === "date"
                    ? "date"
                    : fieldConfig.type === "password"
                    ? "password"
                    : "text"
                }
                disabled={isLoading}
                className="h-9"
                {...field}
                value={(field.value as string) ?? ""}
              />
            ) : fieldConfig.type === "number" ? (
              <Input
                type="number"
                placeholder={fieldConfig.placeholder ?? ""}
                disabled={isLoading}
                className="h-9"
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                value={(field.value as number) ?? ""}
              />
            ) : fieldConfig.type === "textarea" ? (
              <Textarea
                placeholder={fieldConfig.placeholder ?? ""}
                disabled={isLoading}
                rows={2}
                className="resize-none"
                {...field}
                value={(field.value as string) ?? ""}
              />
            ) : fieldConfig.type === "select" ? (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as string}
                disabled={isLoading}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue
                    placeholder={
                      fieldConfig.placeholder ??
                      `Seleccione ${fieldConfig.label.toLowerCase()}`
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {fieldConfig.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : fieldConfig.type === "boolean" ? (
              <div className="flex items-center gap-2 pt-0.5">
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground">
                  {fieldConfig.label}
                </span>
              </div>
            ) : (
              <Input
                disabled={isLoading}
                className="h-9"
                {...field}
                value={(field.value as string) ?? ""}
              />
            )}
          </FormControl>
          <FormMessage className="text-[11px] font-normal mt-0.5" />
        </FormItem>
      )}
    />
    </div>
  );
};
