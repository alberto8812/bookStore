# BookStore — Backend

Backend del proyecto BookStore. Ver documentación completa en el [README raíz](../README.md).

## Comandos rápidos

```bash
# Levantar con hot-reload (desde la raíz del proyecto)
docker compose up

# Ejecutar seed
docker compose exec backend pnpm run seed

# Crear migración
docker compose exec backend npx prisma migrate dev --name nombre

# Regenerar cliente Prisma
docker compose exec backend npx prisma generate
```

## Credenciales del seed

| Email | Password |
|-------|----------|
| admin@bookstore.com | Password123! |
| test@bookstore.com | Password123! |
