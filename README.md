# BookStore API

API REST para gestión de libros construida con NestJS, Prisma 7 y PostgreSQL, orquestada con Docker Compose.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js 22 |
| Framework | NestJS 11 |
| ORM | Prisma 7 |
| Base de datos | PostgreSQL 16 |
| Autenticación | JWT + Passport |
| Gestor de paquetes | pnpm |
| Entorno | Docker Compose |

---

## Requisitos

- Docker Desktop
- pnpm (solo para desarrollo local sin Docker)

---

## Levantar el entorno

```bash
# Primera vez o tras cambios en dependencias
docker compose up --build

# Levantar en background
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f backend

# Bajar los contenedores
docker compose down
```

El backend corre en `http://localhost:3000` con hot-reload activo.

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con los siguientes valores:

```env
PORT=3000

DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_NAME=juju

DATABASE_URL="postgresql://postgres:123456@postgres:5432/juju?schema=public"

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET="strseddsss"
```

> **Importante:** dentro de Docker el host de PostgreSQL es `postgres` (nombre del servicio), no `localhost`.
> Desde tu máquina local (fuera de Docker) usa `localhost:5433`.

---

## Migraciones

Ejecutar siempre **dentro del contenedor**:

```bash
# Crear y aplicar una migración nueva
docker compose exec backend npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones pendientes (producción)
docker compose exec backend npx prisma migrate deploy

# Regenerar el cliente de Prisma
docker compose exec backend npx prisma generate
```

> Para verificar el nombre exacto del contenedor: `docker ps --format "table {{.Names}}"`

---

## Seed

Llena la base de datos con datos iniciales: **2 usuarios** y **200 libros**.

```bash
docker compose exec backend pnpm run seed
```

### Usuarios creados

| Campo | Usuario 1 | Usuario 2 |
|-------|-----------|-----------|
| Nombre | Admin User | Test User |
| Email | admin@bookstore.com | test@bookstore.com |
| Password | Password123! | Password123! |

### Libros creados

- 200 libros de literatura universal en español
- Precios entre $9.99 y $29.99
- 1 de cada 5 libros con estado `reserved`, el resto `available`
- Fechas escalonadas (1 hora entre cada libro) para paginación por cursores

> El seed limpia las tablas antes de insertar. No ejecutar en producción.

---

## Estructura del proyecto

```
bookStore/
├── back/                        # Backend NestJS
│   ├── src/
│   │   ├── auth/                # Módulo de autenticación (JWT)
│   │   ├── book-store/          # Módulo de libros
│   │   │   ├── domain/          # Modelos e interfaces de dominio
│   │   │   ├── aplication/      # Casos de uso y DTOs
│   │   │   └── insfrastructure/ # Repositorios Prisma y controladores
│   │   ├── shared/              # Utilidades compartidas (DB, DTOs, interfaces)
│   │   └── config/              # Validación de variables de entorno
│   ├── prisma/
│   │   ├── schema.prisma        # Modelos y migraciones
│   │   ├── seed.ts              # Script de seed
│   │   └── migrations/          # Migraciones generadas
│   ├── generated/prisma/        # Cliente Prisma generado (no editar)
│   ├── prisma.config.ts         # Configuración de Prisma 7
│   └── dockerfile.dev
├── compose.yml                  # Orquestación principal (PostgreSQL)
├── compose.override.yml         # Variables de entorno por servicio
└── .env                         # Variables de entorno (no commitear)
```

---

## Modelos

### `book`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String (UUID) | PK generado automáticamente |
| title | String | Título del libro |
| author | String | Autor |
| description | String | Descripción |
| price | Float | Precio |
| status | Enum | `available` / `reserved` |
| created_at | DateTime | Fecha de creación |
| created_by_id | String? | FK a user |

**Índices para paginación por cursores:**
- `(created_at DESC, id DESC)` — paginación hacia adelante
- `(created_at ASC, id ASC)` — paginación hacia atrás

### `user`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String (UUID) | PK generado automáticamente |
| name | String | Nombre |
| email | String | Email único |
| password | String | Contraseña hasheada (bcrypt) |
| created_at | DateTime | Fecha de creación |

---

## Paginación

Los endpoints de listado usan **paginación por cursores** basada en `created_at + id`.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `limit` | number | Cantidad de resultados (default: 10) |
| `afterCursor` | string | ID del último elemento visto → página siguiente |
| `beforeCursor` | string | ID del primer elemento visto → página anterior |
| `search` | string | Búsqueda en `title` y `author` |
| `filters` | IFilter[] | Filtros dinámicos por campo y operador |

---

## Instalar dependencias

Siempre instalar dentro del contenedor para que `package.json` y `pnpm-lock.yaml` se actualicen en tu máquina local (gracias al volume mount):

```bash
# Dependencia de producción
docker compose exec backend pnpm add <paquete>

# Dependencia de desarrollo
docker compose exec backend pnpm add -D <paquete>
```

Tras instalar, commitea los archivos actualizados y haz rebuild:

```bash
git add back/package.json back/pnpm-lock.yaml
git commit -m "feat: add <paquete>"
docker compose up --build
```

> El rebuild es necesario porque `node_modules` vive en un volumen anónimo.

---

## Generar módulos con NestJS CLI

```bash
docker compose exec backend npx nest g module nombre
docker compose exec backend npx nest g controller nombre
docker compose exec backend npx nest g service nombre
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

El cliente se genera en `generated/prisma/` (definido por `output` en el schema).
Los tipos del modelo se importan desde `generated/prisma/client`.
