import type { FormConfig } from "@/shared/domain/base/form-config.types";


export const bookFormConfig: FormConfig = {
    fields: [
        { name: "title", label: "Título", type: "text", required: true, maxLength: 150, placeholder: "Título del libro" },
        { name: "author", label: "Autor", type: "text", required: true, maxLength: 150, placeholder: "Nombre del autor" },
        { name: "description", label: "Descripción", type: "text", required: true, maxLength: 500, placeholder: "Descripción del libro" },
        { name: "published_date", label: "Fecha de Publicación", type: "date", required: true },
        { name: "price", label: "Precio", type: "number", required: true, min: 0 },
        {
            name: "status", label: "Estado", type: "select", required: true, maxLength: 50, placeholder: "Disponible", options: [
                { label: "Disponible", value: "available" },
                { label: "No Disponible", value: "unavailable" }
            ]
        },

    ],
};
