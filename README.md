# Pokédex Full Stack

Aplicación Full Stack desarrollada con **React, TypeScript, Node.js, Express, Prisma, MySQL y Redis** que consume datos de [PokéAPI](https://pokeapi.co/), los normaliza y persiste en una base de datos relacional, y los expone mediante una API REST propia protegida con autenticación JWT.

El frontend permite registrarse, iniciar y cerrar sesión, buscar y filtrar Pokémon, navegar entre páginas y consultar el detalle de cada Pokémon en una interfaz responsive inspirada en una Pokédex.

## Características

- Sincronización de los primeros **151 Pokémon** desde PokéAPI.
- Persistencia en MySQL mediante Prisma ORM.
- Modelo relacional normalizado para Pokémon, tipos y habilidades.
- API REST propia con paginación, búsqueda, filtros y ordenamiento.
- Vista de detalle por ID.
- Navegación al Pokémon anterior y siguiente.
- Registro e inicio de sesión.
- Autenticación mediante **access token y refresh token JWT**.
- Rutas de Pokémon protegidas en backend.
- Rutas privadas en React.
- Renovación automática del access token cuando expira.
- Cierre de sesión con invalidación de sesión almacenada en Redis.
- Caché de consultas de Pokémon con Redis.
- Invalidación de caché durante la sincronización.
- Validación de datos con Zod.
- Logs estructurados con Pino.
- Interfaz Mobile First y responsive.
- Tests de backend y frontend con Vitest.
- Especificación de la API con **OpenAPI 3.0** en `backend/docs/openapi.yaml`.
- Entorno completo con **Docker Compose** para levantar frontend, backend, MySQL y Redis.

---

## Tecnologías

### Backend

- Node.js
- Express 5
- TypeScript
- Prisma ORM
- MySQL 8
- Redis
- Zod
- JSON Web Token
- bcrypt
- Pino / pino-http
- Vitest

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Testing Library
- Vitest
- CSS responsive / Mobile First

### Infraestructura local

- Docker
- Docker Compose

---

## Arquitectura

El backend separa las responsabilidades principales en capas:

```text
backend/src/
├── config/          # Base de datos, Redis y variables de entorno
├── controllers/     # Entrada HTTP y respuestas
├── errors/          # Errores de aplicación
├── middlewares/     # Auth, errores y 404
├── repositories/    # Acceso a datos mediante Prisma
├── routes/          # Definición de endpoints
├── schemas/         # Validaciones Zod
├── scripts/         # Sincronización de PokéAPI
├── services/        # Lógica de negocio, caché, auth y sincronización
└── utils/           # JWT, passwords, logs y utilidades
```

El frontend mantiene separadas las páginas, componentes, autenticación, servicios HTTP y tipos:

```text
frontend/src/
├── auth/            # Contexto, provider y protección de rutas
├── components/      # Componentes reutilizables
├── pages/           # Login, registro, listado y detalle
├── services/        # Cliente API, auth y Pokémon
├── types/           # Tipos TypeScript
└── assets/
```

---

# Instalación local

## Requisitos previos

Antes de comenzar necesitas tener instalado:

- **Node.js** 20 o superior recomendado.
- **npm**.
- **Docker Desktop** con Docker Compose.
- **Git**.

Comprueba las instalaciones con:

```bash
node --version
npm --version
docker --version
docker compose version
git --version
```

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/carlosortizj/pokedex.git
cd pokedex
```

La estructura principal es:

```text
pokedex/
├── backend/
├── frontend/
└── docker-compose.yml
```

---

## 2. Levantar el proyecto completo con Docker Compose

Desde la raíz del proyecto ejecuta:

```bash
docker compose up --build
```

Docker Compose construye y levanta los servicios necesarios para ejecutar la aplicación completa:

| Servicio | Puerto | Uso |
|---|---:|---|
| Frontend | `5173` | Interfaz React / Vite |
| Backend | `3000` | API REST con Express |
| MySQL | `3306` | Persistencia principal |
| Redis | `6379` | Caché y sesiones de refresh token |

El backend espera a que MySQL y Redis estén saludables, genera Prisma Client, aplica las migraciones versionadas y luego inicia la API. El frontend queda disponible en `http://localhost:5173`.

Puedes comprobar el estado de los servicios con:

```bash
docker compose ps
```

Para cargar los primeros **151 Pokémon** en una instalación nueva, ejecuta una vez:

```bash
docker compose exec backend npm run pokemon:sync
```

Para detener el entorno:

```bash
docker compose down
```

> Docker Compose ya proporciona las variables necesarias para la ejecución dentro de contenedores. Los pasos siguientes describen la alternativa para ejecutar backend y frontend manualmente con npm.

---

## Ejecución manual del backend

## 3. Instalar dependencias

```bash
cd backend
npm install
```

## 4. Crear las variables de entorno

Copia el archivo de ejemplo:

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### Linux / macOS

```bash
cp .env.example .env
```

El archivo `backend/.env` debe contener una configuración similar a:

```env
DATABASE_URL="mysql://pokedex:pokedex@localhost:3306/pokedex?allowPublicKeyRetrieval=true"
REDIS_URL="redis://localhost:6379"
PORT=3000
POKEAPI_URL="https://pokeapi.co/api/v2"
LOG_LEVEL=info
JWT_ACCESS_SECRET="change-this-access-secret"
JWT_REFRESH_SECRET="change-this-refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

Para un entorno real debes sustituir los secretos JWT por valores largos y privados.

---

## 5. Generar Prisma Client

```bash
npm run prisma:generate
```

---

## 6. Aplicar las migraciones

Las migraciones del proyecto ya están versionadas en `backend/prisma/migrations`.

Para preparar una base de datos nueva ejecuta:

```bash
npx prisma migrate deploy
```

Esto creará las tablas necesarias para:

- usuarios;
- Pokémon;
- tipos;
- habilidades;
- relaciones Pokémon-Tipo;
- relaciones Pokémon-Habilidad.

Para desarrollo, si vas a crear nuevas migraciones, también está disponible:

```bash
npm run prisma:migrate
```

---

## 7. Sincronizar los Pokémon

Con MySQL y Redis activos ejecuta:

```bash
npm run pokemon:sync
```

El script consulta PokéAPI y sincroniza los primeros **151 Pokémon** junto con sus tipos y habilidades.

La sincronización puede volver a ejecutarse posteriormente para actualizar los datos persistidos. Durante el proceso también se invalida la caché relacionada.

---

## 8. Iniciar el backend

Modo desarrollo:

```bash
npm run dev
```

La API quedará disponible en:

```text
http://localhost:3000
```

Prueba rápidamente el estado del servidor:

```text
GET http://localhost:3000/api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "pokedex-api"
}
```

También puedes verificar la conexión con MySQL mediante:

```text
GET http://localhost:3000/api/health/db
```

---

## Ejecución manual del frontend

Abre otra terminal desde la raíz del proyecto.

## 9. Instalar dependencias

```bash
cd frontend
npm install
```

## 10. Crear las variables de entorno

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### Linux / macOS

```bash
cp .env.example .env
```

Contenido esperado:

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 11. Iniciar el frontend

```bash
npm run dev
```

Vite mostrará la URL local, normalmente:

```text
http://localhost:5173
```

Al ingresar por primera vez serás redirigido a `/login`.

Si todavía no tienes una cuenta, selecciona la opción de registro y crea un usuario. La contraseña debe contener **al menos 8 caracteres**.

---

# Inicio rápido

La forma recomendada de ejecutar el proyecto completo es Docker Compose:

```bash
git clone https://github.com/carlosortizj/pokedex.git
cd pokedex
docker compose up --build
```

En una instalación nueva, carga los datos iniciales desde otra terminal:

```bash
docker compose exec backend npm run pokemon:sync
```

Luego abre:

```text
http://localhost:5173
```

La API queda disponible en:

```text
http://localhost:3000
```

Al entrar al frontend sin sesión activa serás redirigido a `/login`. Puedes crear una cuenta desde `/register`.

---

# Autenticación

La aplicación utiliza dos JWT:

- **Access token:** duración predeterminada de 15 minutos.
- **Refresh token:** duración predeterminada de 7 días.

Al iniciar sesión, ambos tokens son almacenados por el frontend. Las solicitudes a las rutas protegidas incluyen automáticamente:

```http
Authorization: Bearer <access-token>
```

Si el access token expira:

1. la API responde con `401`;
2. el frontend utiliza el refresh token;
3. solicita un nuevo access token mediante `/api/auth/refresh`;
4. almacena el nuevo access token;
5. repite automáticamente la petición original.

Si el refresh token ya no es válido, se eliminan los tokens locales y el usuario vuelve al login.

Las sesiones asociadas a refresh tokens se gestionan también en **Redis**, lo que permite invalidarlas al cerrar sesión.

---

# Endpoints principales

## Estado del sistema

| Método | Endpoint | Protección | Descripción |
|---|---|---|---|
| GET | `/api/health` | Pública | Estado de la API |
| GET | `/api/health/db` | Pública | Estado de la conexión a MySQL |

## Autenticación

| Método | Endpoint | Protección | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | Pública | Registrar usuario |
| POST | `/api/auth/login` | Pública | Iniciar sesión |
| GET | `/api/auth/me` | JWT | Obtener usuario autenticado |
| POST | `/api/auth/refresh` | Refresh token | Renovar access token |
| POST | `/api/auth/logout` | Refresh token | Cerrar e invalidar sesión |

### Registro

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123"
}
```

---

## Pokémon

Todas las rutas `/api/pokemon` requieren un access token válido.

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/pokemon` | Listado paginado |
| GET | `/api/pokemon/:id` | Detalle por ID externo |

### Listado

Ejemplo:

```http
GET /api/pokemon?page=1&limit=10
Authorization: Bearer <access-token>
```

Parámetros disponibles:

| Parámetro | Descripción | Valor por defecto |
|---|---|---|
| `page` | Página solicitada | `1` |
| `limit` | Registros por página, máximo 100 | `10` |
| `search` | Búsqueda por nombre | — |
| `type` | Filtro por tipo | — |
| `sort` | `name` o `externalId` | `externalId` |
| `order` | `asc` o `desc` | `asc` |

Ejemplo con filtros:

```text
/api/pokemon?page=1&limit=10&search=char&type=fire&sort=name&order=asc
```

### Detalle

```http
GET /api/pokemon/25
Authorization: Bearer <access-token>
```

Además de los datos del Pokémon, el detalle incluye información necesaria para navegar al Pokémon anterior y siguiente disponible en la base de datos.

---

# Documentación OpenAPI

La documentación de la API está definida mediante **OpenAPI 3.0** en:

```text
backend/docs/openapi.yaml
```

El archivo documenta los endpoints de autenticación y Pokémon, sus parámetros, respuestas y el esquema de seguridad Bearer JWT. Puede abrirse con Swagger Editor o cualquier visor compatible con OpenAPI 3.0.

---

# Modelo de datos

El proyecto evita almacenar los datos de PokéAPI en una sola tabla desnormalizada.

Las principales entidades son:

```text
User

Pokemon
  ├── PokemonType ── Type
  └── PokemonAbility ── Ability
```

`PokemonType` y `PokemonAbility` actúan como tablas intermedias para representar las relaciones muchos-a-muchos.

En `PokemonAbility` también se almacena si una habilidad es oculta mediante `isHidden`.

---

# Caché con Redis

Redis se utiliza para mejorar las consultas de Pokémon y para el manejo de sesiones de autenticación.

El backend mantiene caché para:

- listados de Pokémon;
- detalles individuales.

Las claves de listado incluyen los filtros y parámetros de paginación para evitar mezclar respuestas diferentes.

Cuando se sincronizan Pokémon se invalidan las claves correspondientes para impedir que se entregue información desactualizada.

---

# Tests

## Backend

Desde `backend`:

```bash
npm test
```

Actualmente se cubren, entre otros comportamientos:

- generación consistente de claves de caché;
- servicio de Pokémon y transformación de datos;
- navegación entre Pokémon;

## Frontend

Desde `frontend`:

```bash
npm test
```

Actualmente el frontend incluye una prueba del buscador con debounce utilizando Vitest, Testing Library y jsdom.

---

# Validaciones de calidad

## Backend

Compilar TypeScript:

```bash
cd backend
npm run build
```

## Frontend

Ejecutar ESLint:

```bash
cd frontend
npm run lint
```

Ejecutar tests:

```bash
npm test
```

Generar build de producción:

```bash
npm run build
```

---

# Build de producción

## Backend

```bash
cd backend
npm run build
npm start
```

El código compilado se genera en `backend/dist`.

## Frontend

```bash
cd frontend
npm run build
npm run preview
```

El build se genera en `frontend/dist`.

Para desplegar en un proveedor externo debes configurar `VITE_API_URL` con la URL pública del backend antes de construir el frontend.

---

# Prisma Studio

Para inspeccionar visualmente la base de datos:

```bash
cd backend
npm run prisma:studio
```

Prisma Studio suele estar disponible en:

```text
http://localhost:5555
```

Desde allí puedes revisar usuarios, Pokémon, tipos, habilidades y sus relaciones.

Las contraseñas de los usuarios no se almacenan en texto plano; únicamente se guarda el hash generado con bcrypt.

---

# Logs

El backend utiliza Pino para producir logs estructurados.

El nivel se controla mediante:

```env
LOG_LEVEL=info
```

Los logs incluyen información de solicitudes HTTP, sincronización, errores de validación, caché y ciclo de vida del servidor.

---

# Solución de problemas

## Algún servicio de Docker no responde

Comprueba los contenedores:

```bash
docker compose ps
```

Si no están activos:

```bash
docker compose up -d
```

Puedes revisar sus logs con:

```bash
docker compose logs mysql
docker compose logs redis
docker compose logs backend
docker compose logs frontend
```

## Prisma no conecta con MySQL

Comprueba que el contenedor esté activo y que `DATABASE_URL` tenga el valor correcto:

```env
DATABASE_URL="mysql://pokedex:pokedex@localhost:3306/pokedex?allowPublicKeyRetrieval=true"
```

## La Pokédex aparece vacía

Después de preparar la base de datos debes ejecutar:

```bash
cd backend
npm run pokemon:sync
```

## Error de conexión con Redis

Comprueba:

```env
REDIS_URL="redis://localhost:6379"
```

y que el contenedor `pokedex-redis` esté activo.

## El frontend no puede acceder al backend

Comprueba `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Después de modificar variables de Vite debes reiniciar el servidor del frontend.

## Una ruta de Pokémon responde 401

Las rutas de Pokémon son privadas. Primero debes iniciar sesión y enviar un access token válido mediante el header `Authorization`.

---

# Scripts disponibles

## Backend

| Comando | Descripción |
|---|---|
| `npm run dev` | Ejecuta backend en desarrollo |
| `npm run build` | Compila TypeScript |
| `npm start` | Ejecuta el backend compilado |
| `npm test` | Ejecuta tests con Vitest |
| `npm run pokemon:sync` | Sincroniza los 151 Pokémon |
| `npm run prisma:generate` | Genera Prisma Client |
| `npm run prisma:migrate` | Crea/aplica migraciones en desarrollo |
| `npm run prisma:studio` | Abre Prisma Studio |

## Frontend

| Comando | Descripción |
|---|---|
| `npm run dev` | Ejecuta Vite en desarrollo |
| `npm run build` | Genera el build |
| `npm run preview` | Previsualiza el build |
| `npm run lint` | Ejecuta ESLint |
| `npm test` | Ejecuta tests con Vitest |

---

# Decisiones técnicas

### Docker Compose

El entorno de desarrollo puede levantarse de forma reproducible con `docker compose up --build`. Los servicios se comunican por la red interna de Docker usando los nombres `mysql` y `redis`, mientras que el navegador consume el backend a través de `http://localhost:3000`.

### Persistencia local de PokéAPI

El frontend no consume PokéAPI directamente. Los datos externos son sincronizados previamente y posteriormente consultados desde la API propia. Esto desacopla la interfaz de la disponibilidad del proveedor externo y permite normalizar, filtrar y cachear la información internamente.

### Prisma + MySQL

Prisma ofrece tipado y una capa clara de acceso a datos, mientras que el modelo relacional permite representar correctamente tipos y habilidades sin duplicar información innecesariamente.

### Redis

Se utiliza tanto para caché de Pokémon como para controlar las sesiones asociadas a refresh tokens.

### Access token + refresh token

El access token es deliberadamente corto. El refresh token permite mantener la sesión sin obligar al usuario a autenticarse nuevamente cada vez que el access token vence.

### Arquitectura por capas

Controllers, services y repositories mantienen separadas la capa HTTP, la lógica de negocio y el acceso a datos, facilitando pruebas y mantenimiento.

---

# Autor

**Carlos Ortiz**  
Full Stack Developer

GitHub: [carlosortizj](https://github.com/carlosortizj)

---

## Repositorio

[github.com/carlosortizj/pokedex](https://github.com/carlosortizj/pokedex)
