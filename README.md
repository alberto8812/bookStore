# BookStore

Aplicación full-stack para gestión de libros. Backend con NestJS + Prisma, frontend con React + Vite, orquestados con Docker Compose.

---

## Stack

### Backend
| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js 22 |
| Framework | NestJS 11 |
| ORM | Prisma 7 |
| Base de datos | PostgreSQL 16 |
| Caché / colas | Redis 7 |
| Autenticación | JWT + Passport |
| Reverse Proxy | Nginx (alpine) |

### Frontend
| Capa | Tecnología |
|------|-----------|
| Framework UI | React 19 |
| Bundler | Vite 8 |
| Estilos | Tailwind CSS v4 |
| Estado servidor | TanStack Query v5 |
| Estado cliente | Zustand v5 |
| Formularios | React Hook Form v7 + Zod v4 |

### Infraestructura
| Herramienta | Uso |
|-------------|-----|
| Docker Compose | Orquestación de todos los servicios |
| pnpm | Gestor de paquetes (back y front) |

---

## Requisitos

- Docker Desktop
- pnpm (solo para desarrollo local sin Docker)

---

## Levantar el entorno completo

```bash
# Primera vez o tras cambios en dependencias
docker compose up --build

# Levantar en background
docker compose up -d

# Bajar todos los contenedores
docker compose down
```

### URLs disponibles

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | `http://localhost:5173` | App React (Vite dev server) |
| API | `http://localhost/api/` | REST API (vía Nginx) |
| Swagger | `http://localhost/docs` | Documentación interactiva |
| Backend directo | `http://localhost:3000` | Puerto directo al backend |
| PostgreSQL | `localhost:5433` | Acceso externo a la BD |
| Redis | `localhost:6379` | Acceso externo a Redis |

### Ver logs por servicio

```bash
docker compose logs -f bookstore-frontend-1
docker compose logs -f bookstore-backend-1
docker compose logs -f reverse-proxy
```

---

## Variables de entorno

Crea un archivo `.env` en la **raíz** del proyecto:

```env
# Backend
PORT_BACKEND=3000
API_URL=http://localhost/api

DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_NAME=juju

DATABASE_URL="postgresql://postgres:123456@postgres:5432/juju?schema=public"

REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET="cambia_esto_en_produccion"

# Frontend
VITE_API_URL=http://localhost/api
```

> **Dentro de Docker**, los hosts son los nombres de servicio Docker (`postgres`, `redis`, `backend`), no `localhost`.
> **Desde tu máquina** (fuera de Docker): PostgreSQL en `localhost:5433`, Redis en `localhost:6379`.

---

## Estructura del proyecto

```
bookStore/
├── back/                        # Backend NestJS
│   ├── src/
│   │   ├── auth/                # Módulo de autenticación (JWT)
│   │   ├── book-store/          # Módulo de libros (domain / application / infrastructure)
│   │   ├── shared/              # Utilidades compartidas (DB, DTOs, paginación)
│   │   └── config/              # Validación de variables de entorno
│   ├── prisma/
│   │   ├── schema.prisma        # Modelos
│   │   ├── seed.ts              # Datos iniciales
│   │   └── migrations/
│   ├── generated/prisma/        # Cliente Prisma generado (no editar)
│   ├── prisma.config.ts
│   ├── compose.yml              # Servicio backend
│   └── dockerfile.dev
├── front/                       # Frontend React + Vite
│   ├── src/
│   │   ├── modules/book/        # Módulo de libros (tabla, formulario, hook)
│   │   └── shared/              # Componentes genéricos, hooks, router, store
│   ├── compose.yml              # Servicio frontend
│   └── dockerfile.dev
├── reverse-proxy/
│   └── nginx.conf               # Enrutamiento Nginx
├── scripts/
│   └── init-databases.sql       # Creación de bases de datos al iniciar postgres
├── compose.yml                  # Orquestación principal (incluye back + front)
├── compose.override.yml         # Puertos y variables de entorno por servicio
└── .env                         # Variables de entorno (no commitear)
```

---

## Arquitectura de red

```
Navegador
    │
    ├── :5173 ──────────────────► frontend (Vite dev server)
    │
    └── :80 ────► Nginx (reverse-proxy)
                      │
                      ├── /docs   ──► backend:3000/docs
                      └── /api/   ──► backend:3000/
                                          │
                                     ┌────┴─────┐
                                     ▼          ▼
                               postgres:5432  redis:6379
```

Todos los servicios comparten la red Docker interna `network` (bridge). El frontend llama a la API a través de Nginx (`http://localhost/api`) — las peticiones las hace el **navegador**, no el contenedor.

---

## Seed

Llena la base de datos con datos iniciales: **2 usuarios** y **200 libros**.

```bash
docker compose exec backend pnpm run seed
```

> **Importante:** usa el nombre del **servicio** (`backend`), no el nombre del contenedor (`bookstore-backend-1`). El comando `docker compose exec` trabaja con nombres de servicio definidos en `compose.yml`.

### Usuarios creados

| Email | Password | Rol |
|-------|----------|-----|
| admin@bookstore.com | Password123! | Admin |
| test@bookstore.com | Password123! | Usuario |

### Libros creados

- 200 libros de literatura universal en español
- Precios entre $9.99 y $29.99
- 1 de cada 5 con estado `reserved`, el resto `available`
- Fechas escalonadas para pruebas de paginación por cursores

> El seed limpia las tablas antes de insertar. No ejecutar en producción.

---

## Migraciones (backend)

Ejecutar siempre **dentro del contenedor**:

```bash
# Crear y aplicar una migración nueva
docker compose exec bookstore-backend-1 npx prisma migrate dev --name nombre

# Aplicar migraciones pendientes (producción)
docker compose exec bookstore-backend-1 npx prisma migrate deploy

# Regenerar el cliente de Prisma
docker compose exec bookstore-backend-1 npx prisma generate
```

---

## Instalar dependencias

Instalar siempre dentro del contenedor para que el lock file se actualice en el host:

```bash
# Backend
docker compose exec bookstore-backend-1 pnpm add <paquete>

# Frontend
docker compose exec bookstore-frontend-1 pnpm add <paquete>
```

Tras instalar, commitea el `package.json` y `pnpm-lock.yaml` correspondiente y haz rebuild:

```bash
docker compose up --build
```

> El rebuild es necesario porque `node_modules` vive en un volumen anónimo separado del bind mount.

---

## Swagger

Documentación interactiva disponible en `http://localhost/docs`.

Para endpoints protegidos, haz clic en **Authorize** e ingresa:

```
Bearer <tu_token_jwt>
```

---

## Prisma 7 — consideraciones

En Prisma 7 la URL de conexión **no va en `schema.prisma`**, sino en `prisma.config.ts`:

```ts
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

El cliente se genera en `generated/prisma/` e importa desde `generated/prisma/client`.

---

## Paginación

Los endpoints de listado usan **paginación por cursores** basada en `created_at + id`.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `limit` | number | Cantidad de resultados (default: 20) |
| `afterCursor` | string | Cursor → página siguiente |
| `beforeCursor` | string | Cursor → página anterior |
| `search` | string | Búsqueda en `title` y `author` |
| `filters` | FilterDto[] | Filtros dinámicos por campo y operador |

### Operadores de filtro disponibles

`equals` · `contains` · `in` · `gt` · `lt`
