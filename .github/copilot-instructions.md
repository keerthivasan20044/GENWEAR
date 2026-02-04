<!-- Copilot instructions for AI coding agents working on GENWEAR -->
# GENWEAR — AI Coding Assistant Guide

Purpose: quickly orient code-writing agents to this MERN e‑commerce codebase so contributions are correct, minimal, and idiomatic.

- **Big picture:** This is a MERN app split into two folders: the frontend at `client/` (React + Vite) and the backend at `server/` (Express + Mongoose). Frontend talks to backend via `/api/*` endpoints. See [README.md](README.md) for high-level docs.

- **Where to look first:**
  - Backend entry: [server/server.js](server/server.js)
  - API routes: [server/routes](server/routes) (auth, products, orders, admin)
  - Controllers: [server/controllers](server/controllers) — business logic lives here
  - Models: [server/models](server/models) — Mongoose schemas and important field names (e.g., `isActive`, `stockQuantity`)
  - Seed data: [server/data/seedData.js](server/data/seedData.js)
  - Frontend store: [client/src/redux/store.js](client/src/redux/store.js) (redux-persist for `cart` and `wishlist`)
  - Frontend entry & routes: [client/src/App.jsx](client/src/App.jsx)
  - Axios wrapper: [client/src/utils/axios.js](client/src/utils/axios.js)

- **Key architecture notes (affect code & PRs):**
  - Authentication uses JWT; admin vs customer access enforced by `authenticate` and `authorizeAdmin` middleware. See [server/middleware/authMiddleware.js](server/middleware/authMiddleware.js).
  - APIs frequently validate input with `express-validator` in route files (example: `server/routes/productRoutes.js`). Preserve these checks when adding endpoints.
  - Products use a soft-delete pattern (`isActive: false`) instead of hard deletes — follow that convention.
  - Product categories are normalized to lowercase and restricted to ['men','women','kids','essentials','new'].
  - Frontend persists `cart` and `wishlist` with `redux-persist`; changing the reducer shape requires migration or clearing persisted keys.

- **Developer workflows & commands:**
  - Backend dev: `cd server && npm install` then `npm run dev` (uses `nodemon`, default port `5000`). Seed DB with `npm run seed`.
  - Frontend dev: `cd client && npm install` then `npm run dev` (Vite, default port `5173`).
  - Health check endpoint: `GET /api/health` helps quickly verify backend is running.

- **Environment & integrations:**
  - Expect `.env` values: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `CLOUDINARY_*`. Keep Cloudinary image uploads and CORS origin in mind when changing uploads or URLs.
  - Database: MongoDB (local or Atlas). Many controllers rely on Mongoose queries and indexes — preserve query shapes for pagination and filtering.

- **Patterns and conventions to follow in code changes:**
  - Use feature-based folders (updates belong next to their slice/controller). Match existing naming and export styles (ES modules).
  - Keep API responses consistent: controllers generally return JSON with `{ message, data }` or `{ products, pagination }` shapes — follow existing patterns.
  - Validate inputs at the route level with `express-validator` rather than only in controllers.
  - Prefer soft updates (e.g., toggling `isActive`) over destructive deletes where the project already does so.
  - For frontend, use existing slices in `client/src/redux/slices` and avoid duplicating state; update `store.js` if adding persisted state.

- **Debugging tips:**
  - Use `console.log` in controllers; backend logs print to the terminal where `npm run dev` is running.
  - To check DB connectivity or seed issues, inspect `server/config/db.js` and `server/data/seedData.js`.
  - For CORS/ENV problems, confirm `CLIENT_URL` and `MONGO_URI` in the server `.env`.

- **What NOT to change without a clear reason:**
  - API shapes and query parameters used by the frontend (filters: `category`, `minPrice`, `maxPrice`, `inStock`, `search`, `sort`, `page`, `limit`). Breaking these will require frontend changes.
  - `redux-persist` keys for `cart` and `wishlist` unless migration strategy is provided.

If any section is unclear or you want more examples (e.g., a canonical API response shape or common Redux slice patterns), tell me which area to expand. 
