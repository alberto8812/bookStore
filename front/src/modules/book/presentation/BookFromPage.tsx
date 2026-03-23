import { Form } from "@/shared/presentation/componentes/ui/form";
import { useForm, type Control, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildZodSchema } from "@/shared/presentation/validators/build-zod-schema";
import { bookFormConfig } from "../domain/base/forms/book-from.base";
import { useParams } from "react-router-dom";
import { useBook } from "./hook/use-book";

export const BookFromPage = () => {
  //obtener el ide del libro de la url
  const { id } = useParams();
  const {} = useBook(id);
  const allFields = bookFormConfig.fields;
  const schema = buildZodSchema(allFields);
  const form = useForm({
    resolver: zodResolver(schema),
    //  defaultValues: computedDefaults,
  });
  return (
    <div className="flex flex-1 min-h-0 flex-col p-3 gap-0">
      <div className="shrink-0 flex flex-col gap-1 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Crear Libro</h1>
        <p className="text-sm text-muted-foreground">
          Rellena el formulario para crear un nuevo libro
        </p>
      </div>
      <h1>{id}</h1>
      {/* Main Content */}
      <Form {...form}>
        <form></form>
      </Form>
    </div>
  );
};
