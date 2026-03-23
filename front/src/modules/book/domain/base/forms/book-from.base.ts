import type { FormConfig } from "@/shared/domain/base/form-config.types";


export const bookFormConfig: FormConfig = {
    fields: [
        { name: "title", label: "Título", type: "text", required: true, maxLength: 150, placeholder: "Título del libro", colSpan: 2 },
        { name: "autor", label: "Autor", type: "text", required: true, maxLength: 150, placeholder: "Nombre del autor", colSpan: 2 },
        { name: "description", label: "Descripción", type: "textarea", required: true, maxLength: 500, placeholder: "Descripción del libro", colSpan: 2 },
        { name: "price", label: "Precio", type: "number", required: true, min: 0, colSpan: 1 },
        {
            name: "status", label: "Estado", type: "select", required: true, maxLength: 50, placeholder: "Disponible", colSpan: 1, options: [
                { label: "Disponible", value: "available" },
                { label: "No Disponible", value: "unavailable" }
            ]
        },
    ],
};
