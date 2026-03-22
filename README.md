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
| Reverse Proxy | Nginx (alpine) |
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
├── reverse-proxy/
│   └── nginx.conf               # Configuración del reverse proxy Nginx
├── compose.yml                  # Orquestación principal (PostgreSQL + Nginx)
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

## Reverse Proxy (Nginx)

El stack incluye un reverse proxy basado en **Nginx** que actúa como punto de entrada único en el puerto `80`. Esto evita exponer el backend directamente y permite enrutar el tráfico hacia los distintos servicios de forma centralizada.

### Enrutamiento

| Ruta pública | Destino interno | Descripción |
|--------------|-----------------|-------------|
| `localhost/docs` | `backend:3000/docs` | Swagger UI |
| `localhost/api/` | `backend:3000/` | API REST |

- Las peticiones a `/docs` se redirigen al servidor de documentación de NestJS.
- Las peticiones a `/api/` se redirigen al backend con strip del prefijo `/api` (por ejemplo, `localhost/api/books` → `backend:3000/books`).
- Nginx reenvía cabeceras relevantes: `Host`, `X-Real-IP`, `X-Forwarded-For` y `X-Forwarded-Proto`.

### Arquitectura de red

Todos los servicios comparten la misma red Docker interna (`network`, tipo `bridge`):

```
Internet
    │
    ▼
 Nginx :80  (reverse-proxy)
    │
    ├── /docs   ──► backend:3000/docs
    └── /api/   ──► backend:3000/
                        │
                   ┌────┴─────┐
                   ▼          ▼
             postgres:5432  redis:6379
```

Nginx y el backend se comunican por nombre de servicio Docker (`backend`), sin necesidad de exponer el puerto `3000` a la máquina host.

### Levantar el stack completo

```bash
# Primera vez o tras cambios en la configuración de Nginx
docker compose up --build

# Levantar en background
docker compose up -d

# Ver logs del reverse proxy
docker compose logs -f reverse-proxy-backend

# Bajar todos los contenedores
docker compose down
```

> La configuración de Nginx se monta desde `./reverse-proxy/nginx.conf` mediante un bind mount, por lo que cualquier cambio en ese archivo requiere reiniciar el contenedor (`docker compose restart reverse-proxy-backend`).

---

## Swagger

La documentación interactiva de la API está disponible en:

```
http://localhost/docs
```

> Con el reverse proxy activo, accede a través del puerto `80` (sin especificar puerto). La URL directa al backend `http://localhost:3000/docs` también funciona si el puerto está expuesto, pero se recomienda usar la ruta pública.

Incluye todos los endpoints con sus parámetros, cuerpos de request y respuestas. Para endpoints protegidos con `@Auth()`, haz clic en **Authorize** e ingresa el token JWT con el formato:

```
Bearer <tu_token>
```

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
