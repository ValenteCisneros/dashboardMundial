# Documentación: Lectura/Escritura de datos (Módulo 2)

Este documento muestra el código mínimo y ejemplos para que la aplicación del Módulo 2 lea y escriba datos en la base de datos PostgreSQL usando Prisma en el backend y cómo consumir las rutas desde el frontend.

Requisitos
- `DATABASE_URL` configurada en el archivo raíz `.env`.
- Dependencias backend: `@prisma/client`, `prisma`, `express`.
- Dependencias frontend: `axios` (el cliente base está en `src/api/client.js`).

Comandos útiles
```bash
# Instalar dependencias (backend)
npm install @prisma/client prisma

# Generar cliente Prisma
npx prisma generate

# Crear migración de desarrollo (si aplica)
npx prisma migrate dev --name init

# Ejecutar seed (si existe)
node server/seed.js
```

Archivos de referencia
- `server/prisma/schema.prisma`
- `.env`
- `src/api/client.js`
- `server/utils/asyncHandler.js`

1) Conexión a la base de datos (Prisma)

Archivo sugerido: `server/prismaClient.js`

```js
// server/prismaClient.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({ log: ['query', 'error'] });

module.exports = prisma;
```

Ejemplo mínimo de `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Visitor {
  id        Int      @id @default(autoincrement())
  name      String
  email     String?  @unique
  createdAt DateTime @default(now())
}
```

2) Servicio de acceso a datos (leer/escribir)

`server/services/visitorService.js`

```js
const prisma = require('../prismaClient');

async function createVisitor(data) {
  return prisma.visitor.create({ data });
}

async function getVisitors({ skip = 0, take = 50 } = {}) {
  return prisma.visitor.findMany({ skip, take, orderBy: { createdAt: 'desc' } });
}

async function getVisitorById(id) {
  return prisma.visitor.findUnique({ where: { id: Number(id) } });
}

async function updateVisitor(id, changes) {
  return prisma.visitor.update({ where: { id: Number(id) }, data: changes });
}

async function deleteVisitor(id) {
  return prisma.visitor.delete({ where: { id: Number(id) } });
}

module.exports = { createVisitor, getVisitors, getVisitorById, updateVisitor, deleteVisitor };
```

3) Controlador Express (usa `server/utils/asyncHandler.js`)

`server/controllers/visitorController.js`

```js
const asyncHandler = require('../utils/asyncHandler');
const visitorService = require('../services/visitorService');

exports.create = asyncHandler(async (req, res) => {
  const created = await visitorService.createVisitor(req.body);
  res.status(201).json(created);
});

exports.list = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 50 } = req.query;
  const skip = (page - 1) * pageSize;
  const data = await visitorService.getVisitors({ skip: Number(skip), take: Number(pageSize) });
  res.json(data);
});

exports.get = asyncHandler(async (req, res) => {
  const record = await visitorService.getVisitorById(req.params.id);
  if (!record) return res.status(404).json({ message: 'Not found' });
  res.json(record);
});

exports.update = asyncHandler(async (req, res) => {
  const updated = await visitorService.updateVisitor(req.params.id, req.body);
  res.json(updated);
});

exports.remove = asyncHandler(async (req, res) => {
  await visitorService.deleteVisitor(req.params.id);
  res.status(204).end();
});
```

4) Rutas (Express)

`server/routes/visitors.js`

```js
const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

router.get('/', visitorController.list);
router.post('/', visitorController.create);
router.get('/:id', visitorController.get);
router.put('/:id', visitorController.update);
router.delete('/:id', visitorController.remove);

module.exports = router;
```

Y regístrala en el servidor principal, por ejemplo en `server/server.js`:

```js
const visitorsRouter = require('./routes/visitors');
app.use('/api/visitors', visitorsRouter);
```

5) Llamadas desde el frontend (Módulo 2)

`src/api/client.js` (existente) debería exponer el `baseURL`:

```js
import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

export default client;
```

Funciones de API de ejemplo (p.ej. `src/api/dashboardApi.js`):

```js
export function fetchVisitors(params) { return client.get('/visitors', { params }); }
export function createVisitor(payload) { return client.post('/visitors', payload); }
export function updateVisitor(id, payload) { return client.put(`/visitors/${id}`, payload); }
export function deleteVisitor(id) { return client.delete(`/visitors/${id}`); }
```

Uso en un componente React:

```js
import { useEffect, useState } from 'react';
import { fetchVisitors, createVisitor } from '../api/dashboardApi';

function VisitorsList() {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => { fetchVisitors({ page: 1, pageSize: 50 }).then(res => setVisitors(res.data)); }, []);

  const add = async () => {
    const newV = await createVisitor({ name: 'Ana', email: 'ana@example.com' });
    setVisitors(prev => [newV.data, ...prev]);
  };

  return null; // render según tu UI
}
```

6) Buenas prácticas
- Nunca exponer `DATABASE_URL` en el frontend.
- Validar datos en controladores (p.ej. `Joi` o `express-validator`).
- Cerrar `PrismaClient` con `await prisma.$disconnect()` en scripts y tests.
- Usar `prisma.$transaction` para operaciones atómicas.
- Evitar N+1 con `include`/`select`.

7) Seed de ejemplo (si no existe)

`server/seed.js`:

```js
const prisma = require('./prismaClient');

async function main() {
  await prisma.visitor.createMany({ data: [
    { name: 'Visitor 1', email: 'v1@example.com' },
    { name: 'Visitor 2', email: 'v2@example.com' }
  ], skipDuplicates: true });
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
```

Ejecuta:
```bash
node server/seed.js
```

8) Resumen rápido
- Backend: Prisma + servicios que usan `prisma`.
- Frontend: consumir `/api/*` con `src/api/client.js`.
- Ejecutar `npx prisma generate` tras cambios en `schema.prisma`.

---

Si quieres, puedo:
- añadir los archivos `server/prismaClient.js`, `server/services/visitorService.js`, `server/controllers/visitorController.js`, `server/routes/visitors.js` directamente al repo, o
- generar las funciones concretas en `src/api/dashboardApi.js` y ejemplos en componentes.

Indica qué prefieres y lo aplico.
