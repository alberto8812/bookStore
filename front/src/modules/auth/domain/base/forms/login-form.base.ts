import type { FormConfig } from "@/shared/domain/base/form-config.types";

export const loginFormConfig: FormConfig = {
  fields: [
    {
      name: "email",
      label: "Email",
      type: "text",
      required: true,
      placeholder: "m@ejemplo.com",
      colSpan: 2,
    },
    {
      name: "password",
      label: "Contraseña",
      type: "password",
      required: true,
      placeholder: "••••••••",
      colSpan: 2,
    },
  ],
};
