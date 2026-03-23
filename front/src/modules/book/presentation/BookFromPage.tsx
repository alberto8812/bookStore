import { buildZodSchema } from "@/shared/presentation/validators/build-zod-schema";
import { bookFormConfig } from "../domain/base/forms/book-from.base";
import { useParams } from "react-router-dom";
import { useBook } from "./hook/use-book";
import { Show } from "@/shared/presentation/componentes/ui/Show.component";
import { BookForm } from "./components/BookForm";
import { BookFormSkeleton } from "./components/BookFormSkeleton";
import { initialFormValues } from "../domain/base/forms/initial-from-values.base";
import type { Book } from "../domain/entity/book.entity";

export const BookFromPage = () => {
  const { id } = useParams();
  const { data, isLoading, updateMutation } = useBook(id);

  const handleSubmit = (formData: Record<string, unknown>) => {
    const { ...restFormData } = formData;
    updateMutation.mutate({ restFormData } as any);
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col p-6 gap-0 max-w-2xl">
      <div className="shrink-0 flex flex-col gap-1 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {id ? "Editar Libro" : "Crear Libro"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {id
            ? "Modifica los datos del libro"
            : "Rellena el formulario para crear un nuevo libro"}
        </p>
      </div>

      <div className="rounded-xl border bg-card shadow-sm p-6">
        <Show when={!id || !isLoading} fallback={<BookFormSkeleton />}>
          <BookForm
            isloading={isLoading}
            handleSubmit={handleSubmit}
            allFields={bookFormConfig.fields}
            schema={buildZodSchema(bookFormConfig.fields)}
            defaultValues={id === "new" ? initialFormValues : (data as Book)}
            id={id}
          />
        </Show>
      </div>
    </div>
  );
};
