# BookStore — Frontend

Interfaz de administración de la tienda de libros construida con React 19, Vite 8 y Tailwind CSS v4.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework UI | React 19 |
| Bundler | Vite 8 |
| Lenguaje | TypeScript 5.9 |
| Estilos | Tailwind CSS v4 |
| Componentes | shadcn/ui + Base UI |
| Routing | React Router v7 |
| Estado servidor | TanStack Query v5 |
| Estado cliente | Zustand v5 |
| Formularios | React Hook Form v7 + Zod v4 |
| HTTP | Axios |
| Gestor de paquetes | pnpm |

---

## Requisitos

- Node.js 22
- pnpm
- Docker Desktop (para correr con el stack completo)

---

## Desarrollo local (sin Docker)

```bash
cd front
pnpm install
pnpm run dev
```

La app estará disponible en `http://localhost:5173`.

> Asegúrate de que el backend esté corriendo. Por defecto el cliente HTTP apunta a `http://localhost:3000`. Puedes sobreescribirlo con `VITE_API_URL`.

---

## Desarrollo con Docker

Desde la raíz del proyecto:

```bash
# Primera vez o tras cambios en dependencias
docker compose up --build

# Levantar en background
docker compose up -d

# Ver logs del frontend
docker compose logs -f bookstore-frontend-1

# Bajar todo
docker compose down
```

El frontend corre en `http://localhost:5173` con hot-reload activo.

### Instalar dependencias dentro del contenedor

Para que `pnpm-lock.yaml` se actualice en tu máquina local (gracias al volume mount):

```bash
docker compose exec bookstore-frontend-1 pnpm add <paquete>
docker compose exec bookstore-frontend-1 pnpm add -D <paquete>
```

Tras instalar, haz rebuild:

```bash
docker compose up frontend --build
```

---

## Variables de entorno

Crea un archivo `.env` en `front/`:

```env
VITE_API_URL=http://localhost/api
```

| Variable | Default | Descripción |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000` | URL base del backend |

> En Docker usar `http://localhost/api` para enrutar a través del reverse proxy Nginx.
> En desarrollo local directo usar `http://localhost:3000`.

---

## Estructura del proyecto

```
front/src/
├── components/
│   └── ui/                      # Componentes shadcn/ui (button, input, badge…)
├── modules/
│   └── book/
│       ├── domain/
│       │   ├── entity/          # Interfaces de entidad (Book, CreateBookDTO)
│       │   └── base/forms/      # Configuración de campos del formulario
│       ├── aplication/
│       │   └── use-case/        # Acciones CRUD (findAllPaginated, create, update…)
│       └── presentation/
│           ├── BookPage.tsx     # Listado con tabla y filtros
│           ├── BookFromPage.tsx # Formulario crear/editar
│           ├── components/      # BookForm, columnas de tabla
│           └── hook/            # useBook (paginación + mutaciones)
└── shared/
    ├── aplication/
    │   ├── dtos/                # FilterDto, CursorPaginationParams
    │   └── use-case/            # generiActionQuery — factory de acciones HTTP
    ├── domain/base/             # Interfaces base (repositorio, paginación, form config)
    ├── presentation/
    │   ├── componentes/
    │   │   ├── filters/         # FilterPanel — filtros genéricos reutilizables
    │   │   ├── modals/          # ConfirmDeleteModal
    │   │   ├── tables/          # MainDataTable — tabla con paginación por cursores
    │   │   └── ui/              # PageHeader, Show, Sidebar, form wrappers
    │   ├── hook/                # useQueryModule — hook genérico de paginación
    │   ├── http/                # api-client.ts (axios + interceptores)
    │   ├── layouts/             # DashboardLayout
    │   ├── router/              # Definición de rutas
    │   ├── store/               # auth.store (Zustand)
    │   └── validators/          # build-zod-schema
    └── lib/
        └── utils.ts             # cn()
```

---

## Paginación y filtros

La tabla usa **paginación por cursores** (no offset). Los filtros se envían junto con cada request de paginación como array de `FilterDto`.

### Estructura del request al backend

```ts
POST /book-store/pagination
{
  limit: 10,
  afterCursor?: string,
  beforeCursor?: string,
  filters?: [
    { field: "title",        operator: "contains", Value: "quijote" },
    { field: "status",       operator: "equals",   Value: "available" },
    { field: "published_at", operator: "gt",        Value: "2020-01-01" },
    { field: "published_at", operator: "lt",        Value: "2024-12-31" },
  ]
}
```

### Campos filtrables

| Campo | Tipo | Operador |
|-------|------|---------|
| `title` | Texto | `contains` |
| `autor` | Texto | `contains` |
| `status` | Select (pills) | `equals` |
| `published_at` | Rango de fechas | `gt` / `lt` |

---

## Módulo genérico

El patrón `generiActionQuery` + `useQueryModule` permite agregar nuevos módulos CRUD con mínimo código:

```ts
// 1. Definir acciones
const actions = generiActionQuery<MiEntidad>("/mi-ruta");
export const { findAllPaginated, findById, create, update, remove } = actions;

// 2. Definir hook
export const useMiModulo = (id?: string) =>
  useQueryModule<MiEntidad>("mi-modulo", actions, { id });

// 3. Usar en página
const { listData, isLoading, applyFilters, createMutation } = useMiModulo();
```
