import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Book } from "../../domain/entity/book.entity";

export const columnsBook: ColumnDef<Book>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span
        className="font-mono text-[11px] tracking-tight"
        style={{ color: "var(--color-gray-light)" }}
      >
        {(row.getValue("id") as string).slice(0, 8)}
      </span>
    ),
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <span
        className="font-medium text-sm max-w-[180px] block truncate"
        style={{ color: "var(--color-text-dark)" }}
        title={row.getValue("title")}
      >
        {row.getValue("title")}
      </span>
    ),
  },
  {
    accessorKey: "author",
    header: "Autor",
    cell: ({ row }) => (
      <span
        className="text-sm"
        style={{ color: "var(--color-text-gray)" }}
      >
        {row.getValue("author")}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => (
      <span
        className="text-sm max-w-[280px] block truncate"
        style={{ color: "var(--color-text-gray)" }}
        title={row.getValue("description")}
      >
        {row.getValue("description")}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => (
      <span
        className="font-semibold text-sm tabular-nums"
        style={{ color: "var(--color-teal-dark)" }}
      >
        ${(row.getValue("price") as number).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as "available" | "unavailable";
      return (
        <Badge variant={status === "available" ? "success" : "destructive"}>
          {status === "available" ? "Disponible" : "No disponible"}
        </Badge>
      );
    },
  },
];
