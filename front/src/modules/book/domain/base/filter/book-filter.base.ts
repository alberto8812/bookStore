import type { FilterFieldConfig } from "@/shared/presentation/componentes/filters/filter-field.types";

export const BOOK_FILTER_FIELDS: FilterFieldConfig[] = [
    { key: 'title', label: 'Título', type: 'text', placeholder: 'Buscar por título...' },
    { key: 'autor', label: 'Autor', type: 'text', placeholder: 'Buscar por autor...' },
    {
        key: 'status', label: 'Estado', type: 'select', options: [
            { value: 'available', label: 'Disponible' },
            { value: 'reserved', label: 'No disponible' },
        ]
    },
    { key: 'published_at', label: 'Publicación', type: 'dateRange' },
];