import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/shared/presentation/componentes/ui/form";
import { FieldRenderer } from "@/shared/presentation/componentes/field-from/FiedlRender";
import { buildZodSchema } from "@/shared/presentation/validators/build-zod-schema";
import { loginFormConfig } from "../../domain/base/forms/login-form.base";
import { useAuth } from "../hook/use-aurh";

const schema = buildZodSchema(loginFormConfig.fields);

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { loginMutation } = useAuth();

  const { watch, ...form } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (data: Record<string, unknown>) => {
    loginMutation.mutate(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Bienvenido de nuevo
        </h2>
        <p className="text-sm text-muted-foreground">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      {/* Form */}
      <Form {...form} watch={watch}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-5"
        >
          {loginFormConfig.fields.map((field) => (
            <FieldRenderer
              key={field.name}
              fieldConfig={field}
              control={form.control}
            />
          ))}

          {/* Forgot password — debajo del campo password */}
          <div className="flex justify-end -mt-3">
            {/* <a
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a> */}
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3 pt-1">
            <Button
              type="submit"
              className="h-10 w-full font-medium"
              style={{ backgroundColor: "var(--color-teal)", color: "white" }}
            >
              Iniciar sesión
            </Button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">o</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          </div>
        </form>
      </Form>

      {/* Footer */}
      {/* <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <a
          href="#"
          className="font-medium underline-offset-4 hover:underline"
          style={{ color: "var(--color-teal)" }}
        >
          Regístrate
        </a>
      </p> */}
    </div>
  );
};
