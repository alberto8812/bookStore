import { Skeleton } from "@/components/ui/skeleton";

export function BookFormSkeleton() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* Text fields: Título, Autor, Descripción */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}

      {/* Precio — input más angosto */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      {/* Estado — select */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-48 rounded-md" />
      </div>

      {/* Botón submit */}
      <Skeleton className="h-10 w-32 rounded-md mt-2" />
    </div>
  );
}
