import { useBook } from "./hook/use-book";
import { useState } from "react";
import { PageHeader } from "@/shared/presentation/componentes/ui/PageHeader";
import type { Book } from "../domain/entity/book.entity";
import { Filter, Pencil, Plus, Trash2 } from "lucide-react";
import { Show } from "@/shared/presentation/componentes/ui/Show.component";
import { MainDataTable } from "@/shared/presentation/componentes/tables/MainTable";
import { TableSkeleton } from "@/shared/presentation/componentes/tables/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { columnsBook } from "./components/columns-Book";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/shared/presentation/store/auth.store";

export const BookPage = () => {
  const { authstatus } = useAuthStore();
  const { listData, isLoading, setPagination, pagination } = useBook();
  const navigate = useNavigate();
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
      authstatus === "authenticated"
        ? {
            title: "Crear",
            icon: <Plus className="mr-1.5 h-3.5 w-3.5" />,
            onClick: () => handleCreate(),
          }
        : undefined,
    ].filter((item): item is NonNullable<typeof item> => Boolean(item)),
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
          {authstatus === "authenticated" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleCreate = () => {
    //usar el raouter para  ir a la reuta books/new
    navigate("/dashboard/books/new");
  };

  const handleEdit = (item: Book) => {
    navigate(`/dashboard/books/${item.id}`);
  };

  const handleDelete = (id: string) => {
    console.log("Eliminar item con id:", id);
  };

  const renderBookCard = (book: Book) => (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: "var(--color-white)",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 1px 4px var(--color-shadow-card)",
      }}
    >
      {/* Top row: title + badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-sm leading-snug truncate"
            style={{ color: "var(--color-text-dark)" }}
          >
            {book.title}
          </h3>
          <p
            className="text-xs mt-0.5 truncate"
            style={{ color: "var(--color-text-gray)" }}
          >
            {book.autor}
          </p>
        </div>
        <Badge
          variant={book.status === "available" ? "success" : "destructive"}
          className="shrink-0"
        >
          {book.status === "available" ? "Disponible" : "No disponible"}
        </Badge>
      </div>

      {/* Description */}
      <p
        className="text-xs mt-2.5 line-clamp-2 leading-relaxed"
        style={{ color: "var(--color-text-gray)" }}
      >
        {book.description}
      </p>

      {/* Bottom row: id + price + actions */}
      <div
        className="flex items-center justify-between mt-3 pt-3"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] font-mono"
            style={{ color: "var(--color-gray-light)" }}
          >
            {book.id.slice(0, 8)}
          </span>
          <span
            className="text-sm font-semibold tabular-nums"
            style={{ color: "var(--color-teal)" }}
          >
            ${book.price.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-[var(--color-teal-soft)] hover:text-[var(--color-teal)]"
            onClick={() => handleEdit(book)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={() => handleDelete(book.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );

  // suppress unused warning until dialogs are implemented
  void dialogOpen;
  void editingItem;

  return (
    <div className="flex flex-1 min-h-0 flex-col p-3 gap-0">
      <div className="shrink-0 flex flex-col gap-1 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Book</h1>
        <p className="text-sm text-muted-foreground">
          Administra los libros disponibles en la tienda, incluyendo detalles
        </p>
      </div>
      <div className="shrink-0 pb-3">
        <PageHeader pageHeader={countryHeader} />
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <Show
          when={!isLoading}
          fallback={<TableSkeleton columns={columnsBook.length} />}
        >
          <MainDataTable
            columns={columnsWithActions}
            data={listData?.data}
            pageCount={listData?.pageCount}
            rowCount={listData?.rowCount}
            isLoading={isLoading}
            onPaginationChange={setPagination}
            paginationState={listData?.pageInfo ?? { limit: pagination.limit }}
            renderCard={renderBookCard}
          />
        </Show>
      </div>
    </div>
  );
};
