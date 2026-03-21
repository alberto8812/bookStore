# BookStore

API REST para gestión de libros construida con NestJS, Prisma 7 y PostgreSQL, orquestada con Docker Compose.

## Stack

- **Backend:** NestJS (Node 22, pnpm)
- **ORM:** Prisma 7
- **Base de datos:** PostgreSQL 16
- **Entorno:** Docker Compose

## Requisitos

- Docker Desktop
- pnpm (para desarrollo local sin Docker)

## Levantar el entorno

```bash
docker compose up --build
```

El backend corre en `http://localhost:3000` con hot-reload activo.

Para levantar en background:

```bash
docker compose up -d
```

Para bajar los contenedores:

```bash
docker compose down
```

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores. El archivo `.env` vive en la raíz del proyecto.

> **Importante:** dentro de los contenedores Docker, el host de PostgreSQL es `postgres` (nombre del servicio), no `localhost`. El puerto interno es `5432`, no `5433`.

```env
DATABASE_URL="postgresql://postgres:123456@postgres:5432/juju?schema=public"
DB_HOST=postgres
DB_PORT=5432
```

Desde tu máquina local (fuera de Docker), usa `localhost:5433`.

## Estructura del proyecto

```
bookStore/
├── back/                    # Backend NestJS
│   ├── src/
│   ├── prisma/
│   │   ├── schema.prisma    # Modelos de la base de datos
│   │   └── migrations/      # Migraciones generadas
│   ├── prisma.config.ts     # Config de Prisma 7 (URL de conexión)
│   └── dockerfile.dev
├── compose.yml              # Orquestación principal
├── compose.override.yml     # Variables de entorno por servicio
└── .env                     # Variables de entorno (no commitear)
```

## Prisma 7 — consideraciones importantes

En Prisma 7 la URL de conexión **no va en `schema.prisma`**, sino en `prisma.config.ts`:

```ts
// prisma.config.ts
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

El cliente se genera en `generated/prisma/` (definido por `output` en el schema).

## Migraciones

Los comandos se ejecutan **dentro del contenedor** del backend:

```bash
# Crear y aplicar una migración nueva
docker exec bookstore-backend-1 npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones pendientes (producción)
docker exec bookstore-backend-1 npx prisma migrate deploy

# Regenerar el cliente de Prisma
docker exec bookstore-backend-1 npx prisma generate
```

> Para verificar el nombre exacto del contenedor: `docker ps --format "table {{.Names}}"`

## Modelos

### `book`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int | PK autoincrement |
| title | String | Título del libro |
| author | String | Autor |
| description | String | Descripción |
| price | Float | Precio |
| status | Enum | `available` / `reserved` |
| created_by_id | Int? | FK a user |

### `user`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int | PK autoincrement |
| name | String | Nombre |
| email | String | Email único |
| password | String | Contraseña |

## Instalar dependencias

Siempre instala dentro del contenedor para que el cambio sea inmediato y se actualicen `package.json` y `pnpm-lock.yaml` en tu máquina local (gracias al volume mount).

```bash
# Instalar una dependencia
docker exec bookstore-backend-1 pnpm add <paquete>

# Instalar una dependencia de desarrollo
docker exec bookstore-backend-1 pnpm add -D <paquete>
```

Luego commitea los archivos actualizados y haz rebuild para que la imagen quede lista:

```bash
git add back/package.json back/pnpm-lock.yaml
git commit -m "feat: add <paquete>"

docker compose up --build
```

> El rebuild es necesario porque `node_modules` vive en un volumen anónimo que se pierde al bajar los contenedores con `docker compose down -v` o en otro entorno.

## Hot-reload

El backend usa `nest start --watch`. Cualquier cambio en `back/src/` se refleja automáticamente sin necesidad de rebuild.

Si agregas un módulo nuevo con el CLI de Nest, hazlo dentro del contenedor:

```bash
docker exec -it bookstore-backend-1 npx nest g module nombre
```
