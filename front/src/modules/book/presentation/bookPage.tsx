// import { Filter, Plus, Upload } from "lucide-react";
import { useBook } from "./hook/use-book";
import { useState } from "react";
import { PageHeader } from "@/shared/presentation/componentes/ui/PageHeader";
import type { Book } from "../domain/entity/book.entity";
import { Filter, Pencil, Plus, Trash2 } from "lucide-react";
import { Show } from "@/shared/presentation/componentes/ui/Show.component";
import { MainDataTable } from "@/shared/presentation/componentes/tables/MainTable";
import { TableSkeleton } from "@/shared/presentation/componentes/tables/TableSkeleton";
import { Button } from "@/components/ui/button";
import { columnsBook } from "./components/columns-Book";

export const BookPage = () => {
  const { data, isLoading, setPagination, pagination } = useBook();
  const [dialogOpen, setDialogOpen] = useState({
    importOpen: false,
    editOpen: false,
  });
  const [editingItem, setEditingItem] = useState<Book | null>(null);
  const countryHeader = {
    filters: [
      {
        title: "Filtros",
        icon: <Filter className="mr-1.5 h-3.5 w-3.5" />,
        onClick: () => {},
      },
    ],
    import: [
      {
        title: "Crear",
        icon: <Plus className="mr-1.5 h-3.5 w-3.5" />,
        onClick: () => handleCreate(),
      },
    ],
  };
  const columnsWithActions = [
    ...columnsBook,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: Book } }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  const handleCreate = () => {
    setEditingItem(null);
    setDialogOpen((prev) => ({ ...prev, editOpen: true }));
  };

  const handleEdit = (item: Book) => {
    setEditingItem(item);
    setDialogOpen((prev) => ({ ...prev, editOpen: true }));
  };

  const handleDelete = (id: string) => {
    // Implementa la lógica de eliminación aquí
    console.log("Eliminar item con id:", id);
  };
  return (
    <div className="flex h-full flex-col p-3">
      <div className="flex flex-col gap-1  pb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Book</h1>
        <p className="text-sm text-muted-foreground">
          Administra los libros disponibles en la tienda, incluyendo detalles
        </p>
      </div>
      <PageHeader pageHeader={countryHeader} />

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsBook.length} />}
      >
        <MainDataTable
          columns={columnsWithActions}
          data={data?.data}
          pageCount={data?.pageCount}
          rowCount={data?.rowCount}
          isLoading={isLoading}
          onPaginationChange={setPagination}
          paginationState={data?.pageInfo ?? { limit: pagination.limit }}
        />
      </Show>
    </div>
  );
};
