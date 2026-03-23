import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Loader2, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  pageCount?: number;
  rowCount?: number;
  isLoading?: boolean;
  onPaginationChange?: (pagination: PaginationState) => void;
  paginationState: PaginationState;
  renderCard?: (row: TData) => React.ReactNode;
}

interface PaginationState {
  limit: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

export function MainDataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  rowCount,
  isLoading = false,
  onPaginationChange,
  paginationState,
  renderCard,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pageCount || 0,
  });

  const handlePreviousPage = () => {
    if (onPaginationChange && paginationState?.hasPreviousPage) {
      onPaginationChange({
        limit: paginationState?.limit,
        startCursor: null,
        endCursor: paginationState?.startCursor,
      });
    }
  };

  const handleNextPage = () => {
    if (onPaginationChange && paginationState?.hasNextPage) {
      onPaginationChange({
        limit: paginationState?.limit,
        startCursor: paginationState?.endCursor,
        endCursor: null,
      });
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (onPaginationChange) {
      onPaginationChange({
        limit: newPageSize,
        startCursor: null,
        endCursor: null,
      });
    }
  };

  const totalRows = rowCount || 0;
  const currentRows = table.getRowModel().rows.length;
  const hasRows = currentRows > 0;

  const emptyState = (
    <div className="flex h-48 flex-col items-center justify-center text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">Sin resultados</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        No se encontraron registros
      </p>
    </div>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border">
      <div className="flex-1 overflow-auto">
        {/* ── Desktop table view ── */}
        <div className={renderCard ? "hidden md:block" : ""}>
          <Table>
            <TableHeader
              className="sticky top-0 z-10"
              style={{
                backgroundColor: "var(--color-teal-soft)",
                borderBottom: "1px solid rgba(43,191,176,0.2)",
              }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-0"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-9 text-[11px] font-semibold uppercase tracking-widest"
                      style={{ color: "var(--color-teal-dark)" }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {hasRows ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="transition-colors duration-100 hover:bg-[var(--color-teal-soft)] border-b border-[rgba(0,0,0,0.05)]"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2.5 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-48 p-0">
                    {emptyState}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── Mobile card view ── */}
        {renderCard && (
          <div className="md:hidden p-3 flex flex-col gap-3">
            {hasRows
              ? table.getRowModel().rows.map((row) => (
                  <div key={row.id}>{renderCard(row.original)}</div>
                ))
              : emptyState}
          </div>
        )}
      </div>

      {/* ── Pagination footer ── */}
      <div className="flex shrink-0 items-center justify-between border-t bg-muted/20 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Filas por pagina
          </span>
          <select
            value={paginationState?.limit || 10}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="h-7 rounded-md border border-border bg-card px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          {isLoading && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          )}

          <span className="text-xs text-muted-foreground tabular-nums">
            {hasRows ? `1–${currentRows}` : "0"} de {totalRows}
          </span>

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handlePreviousPage}
              disabled={!paginationState?.hasPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleNextPage}
              disabled={!paginationState?.hasNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
