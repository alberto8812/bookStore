import { Form } from "@/shared/presentation/componentes/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldRenderer } from "@/shared/presentation/componentes/field-from/FiedlRender";
import { Button } from "@/components/ui/button";

interface Props {
  isloading?: boolean;
  handleSubmit: (formData: Record<string, unknown>) => void;
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
  const computedDefaults: Record<string, unknown> = {};
  for (const field of allFields) {
    computedDefaults[field.name] =
      defaultValues?.[field.name] ??
      field.defaultValue ??
      (field.type === "boolean" ? false : "");
  }

  const { watch, ...form } = useForm({
    resolver: zodResolver(schema),
    defaultValues: computedDefaults,
  });

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
        <div className="col-span-2 flex justify-end pt-2">
          <Button type="submit" disabled={isloading}>
            {isloading
              ? "Guardando..."
              : id
                ? "Guardar cambios"
                : "Crear libro"}
          </Button>
          <Button disabled={isloading}>Cancelar</Button>
        </div>
      </form>
    </Form>
  );
};
