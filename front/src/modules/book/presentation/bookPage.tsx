// import { Filter, Plus, Upload } from "lucide-react";
// import { useBook } from "./hook/use-book";
// import { useState } from "react";
// import { PageHeader } from "@/shared/presentation/componentes/ui/PageHeader";
// import { book } from "../../../../../back/dist/generated/prisma/models/book";

export const BookPage = () => {
  //   const { data, isLoading } = useBook();
  //   const [dialogOpen, setDialogOpen] = useState({
  //     importOpen: false,
  //     editOpen: false,
  //   });
  //   const [editingItem, setEditingItem] = useState<book | null>(null);
  //   const countryHeader = {
  //     filters: [
  //       {
  //         title: "Filtros",
  //         icon: <Filter className="mr-1.5 h-3.5 w-3.5" />,
  //         onClick: () => {},
  //       },
  //     ],
  //     import: [
  //       {
  //         title: "Importar Excel",
  //         icon: <Upload className="mr-1.5 h-3.5 w-3.5" />,
  //         onClick: () => setDialogOpen((prev) => ({ ...prev, importOpen: true })),
  //       },
  //       {
  //         title: "Crear",
  //         icon: <Plus className="mr-1.5 h-3.5 w-3.5" />,
  //         onClick: () => handleCreate(),
  //       },
  //     ],
  //   };
  //   const handleCreate = () => {
  //     setEditingItem(null);
  //     setDialogOpen((prev) => ({ ...prev, editOpen: true }));
  //   };

  //   const handleEdit = (item: book) => {
  //     setEditingItem(item);
  //     setDialogOpen((prev) => ({ ...prev, editOpen: true }));
  //   };
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Book. sssss</h1>
        <p className="text-sm text-muted-foreground">
          Administra los libros disponibles en la tienda, incluyendo detalles
        </p>
      </div>
      {/* <PageHeader pageHeader={countryHeader} /> */}
    </div>
  );
};
