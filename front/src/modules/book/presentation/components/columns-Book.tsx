import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Book } from "../../domain/entity/book.entity";

export const columnsBook: ColumnDef<Book>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-medium">
        {(row.getValue("id") as string).slice(0, 8)}
      </span>
    ),
  },
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "author",
    header: "Autor",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => (
      <span>${(row.getValue("price") as number).toFixed(2)}</span>
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
