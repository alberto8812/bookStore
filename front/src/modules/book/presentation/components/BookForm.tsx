import { Form } from "@/shared/presentation/componentes/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldRenderer } from "@/shared/presentation/componentes/field-from/FiedlRender";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/shared/presentation/store/auth.store";
import { Show } from "@/shared/presentation/componentes/ui/Show.component";
import type { CreateBookDTO } from "../../domain/entity/book.entity";

interface Props {
  isloading?: boolean;
  handleSubmit: (formData: CreateBookDTO) => void;
  allFields: any[];
  schema: any;
  defaultValues?: Record<string, unknown>;
  id?: string;
}

export const BookForm = ({
  isloading,
  handleSubmit,
  allFields,
  schema,
  defaultValues,
  id,
}: Props) => {
  const { authstatus } = useAuthStore();
  const computedDefaults: Record<string, unknown> = {};
  for (const field of allFields) {
    let value =
      defaultValues?.[field.name] ??
      field.defaultValue ??
      (field.type === "boolean" ? false : "");
    if (field.type === "date" && typeof value === "string" && value) {
      value = value.split("T")[0];
    }
    computedDefaults[field.name] = value;
  }

  const { watch, ...form } = useForm({
    resolver: zodResolver(schema),
    defaultValues: computedDefaults,
    mode: "onChange",
  });

  const isValid = form.formState.isValid;

  return (
    <Form {...form} watch={watch}>
      <form
        id="book-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid grid-cols-2 gap-x-5 gap-y-5"
      >
        {allFields.map((field) => (
          <FieldRenderer
            key={field.name}
            fieldConfig={field}
            control={form.control}
            isLoading={isloading}
          />
        ))}
        <Show when={authstatus === "authenticated"} fallback={undefined}>
          <div className="col-span-2 flex justify-end pt-2">
            <Button type="submit" disabled={isloading || !isValid}>
              {isloading
                ? "Guardando..."
                : id
                  ? "Guardar cambios"
                  : "Crear libro"}
            </Button>
            <Button disabled={isloading}>Cancelar</Button>
          </div>
        </Show>
      </form>
    </Form>
  );
};
