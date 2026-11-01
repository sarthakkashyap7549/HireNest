# HireNest – Job Portal Frontend

Responsive job portal built with **React 19, Vite, React Router, Bootstrap 5, Express, MySQL and npm**.
The frontend supports both local mock mode and the integrated backend API mode.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

Register an account first, then log in. With `VITE_API_URL` configured, users and applications are persisted in MySQL.

## What is implemented

| Requirement | Where |
|---|---|
| Responsive registration and login (Bootstrap grid, split layout on desktop) | `pages/Login.jsx`, `pages/Register.jsx`, `components/AuthLayout.jsx` |
| Dashboard layout: overview, profile, job listings, applications | `pages/DashboardLayout.jsx` + `Overview`, `Jobs`, `Applications`, `Profile` |
| Form validation with JavaScript + Bootstrap classes (`is-invalid`, `is-valid`, `invalid-feedback`) | `utils/validators.js`, `hooks/useForm.js`, `components/FormField.jsx` |
| Reusable components: Navbar, JobCard, Form | `AppNavbar`, `JobCard`, `FormField` (+ `StatCard`, `SearchFilterBar`, `EmptyState`, `Loader`) |
| State with `useState` | `useForm`, `DashboardLayout`, `Jobs`, `AppNavbar`, `AuthContext` |
| Job listings rendered from data | `data/jobs.js` -> `jobService` -> `Jobs.jsx` (`.map()` into `JobCard`) |
| Search and filter | `SearchFilterBar.jsx` + `useMemo` filtering in `Jobs.jsx` (keyword, location, type, mode, experience, sort) |
| React Router (nested + protected routes) | `App.jsx`, `components/RouteGuards.jsx` |

Other hooks used: `useEffect`, `useMemo`, `useCallback`, `useContext`, and a custom `useForm` hook.

## Folder structure

```
src/
  components/   reusable UI (Navbar, JobCard, FormField, SearchFilterBar, ...)
  pages/        one file per route
  context/      AuthContext (logged-in user + login/register/logout)
  hooks/        useForm (values, touched, errors, submit)
  services/     ALL data access lives here  <-- backend goes here
  data/         seed jobs (replaced by the API later)
  utils/        validators and formatters
```

## Running the backend API

1. Create the database and seed jobs using `backend/database/schema.sql` and `backend/database/seed.sql`.
2. Copy `backend/.env.example` to `backend/.env`, set the MySQL values, and use a JWT secret of at least 32 characters.
3. Start the API:

```bash
cd backend
npm install
npm run dev
```

The API listens on `http://localhost:5000` by default.

## Connecting the frontend to the backend

Every network or storage call goes through `src/services/`. Pages never call `fetch` or `localStorage` directly.

1. Copy `.env.example` to `.env` and set `VITE_API_URL=http://localhost:5000/api` (or `/api` with the proxy in `vite.config.js`).
2. When `VITE_API_URL` is set, each service uses the real API. The frontend validates a saved session through `GET /auth/me` and clears invalid or expired tokens.

| Method | Endpoint | Body | Returns |
|---|---|---|---|
| POST | `/auth/register` | `fullName, email, phone, role, password` | `{ user, token }` |
| POST | `/auth/login` | `email, password` | `{ user, token }` |
| PUT | `/users/me` | profile fields | `{ user }` |
| GET | `/jobs` | – | `{ jobs: [...] }` |
| GET | `/applications` | – | `{ applications: [...] }` |
| POST | `/applications` | `{ jobId }` | `{ application }` |
| DELETE | `/applications/:id` | – | `{ ok: true }` |

Notes for the backend:
- Send the JWT back as `Authorization: Bearer <token>` (already attached by `services/http.js`).
- Hash passwords with bcrypt or argon2. The mock stores plain text only because it is a demo.
- User fields: `id, fullName, email, phone, role, location, headline, skills[], about`.
- Job fields: `id, title, company, location, type, mode, experience, salary (LPA), skills[], postedDaysAgo, description`.
- Application fields: `id, jobId, status, appliedAt` (status: Applied, Under review, Interview, Rejected).
- Repeat the rules from `utils/validators.js` on the server. Client validation is for convenience, not security.
- Later improvements: server-side filtering and pagination on `GET /jobs?q=&location=&type=&page=`.

## Deployment

The supported deployment layout is:

```text
Vercel static site (React/Vite)
        |
        | HTTPS API requests
        v
Render Node web service (Express API)
        |
        | TLS-enabled MySQL connection
        v
Managed MySQL provider
```

### Vercel frontend

1. Import the repository into Vercel with the project root set to this directory.
2. Set the build command to `npm run build` and output directory to `dist` (the committed `vercel.json` supplies these defaults).
3. Set the build-time variable `VITE_API_URL` to the deployed Render API URL ending in `/api`, for example `https://your-api-service.onrender.com/api`.
4. Do not put database credentials or `JWT_SECRET` in Vercel variables; they are not frontend variables and must never be bundled.
5. After the frontend has a stable HTTPS URL, set that exact origin as the backend `CLIENT_URL`.

### Render backend

1. Create a Render Web Service from the repository. The committed `render.yaml` uses `backend` as the root directory.
2. Set the managed MySQL connection values in Render's environment settings:
   `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `DB_SSL=true` when the provider requires TLS.
3. Generate a random `JWT_SECRET` of at least 32 characters and set it only in Render's secret environment settings.
4. Set `CLIENT_URL` to the exact Vercel origin, without a trailing path. Multiple allowed origins may be supplied as a comma-separated value.
5. Render supplies `PORT`; the server binds to it and exposes `GET /health` for service health checks.

### Database setup and migrations

Run these scripts against the managed database using a privileged setup connection before starting the API:

```bash
mysql --host="$DB_HOST" --port="$DB_PORT" --user="$DB_USER" --password "$DB_NAME" < backend/database/schema.sql
mysql --host="$DB_HOST" --port="$DB_PORT" --user="$DB_USER" --password "$DB_NAME" < backend/database/seed.sql
```

The schema script uses `CREATE DATABASE IF NOT EXISTS` and `CREATE TABLE IF NOT EXISTS`; it does not drop tables or delete existing rows. Review the database provider's selected database and backup policy before running it. The seed script is intended for initial job data and uses an idempotent duplicate-key clause. Do not run seed data against a production database unless those jobs are intended to be present.

There is currently no versioned migration tool. For future schema changes, add forward-only numbered migrations and take a database backup before applying them; never use destructive reset commands against a deployed database.

### Free-tier limitations

- Vercel and Render free tiers may suspend idle services, causing cold-start latency.
- A free Render service may not provide durable local disk; this application stores business data in MySQL, not local files.
- A managed MySQL provider may require TLS, allowlisted IPs, a connection limit, or paid capacity.
- The frontend and API are separate origins, so `CLIENT_URL` and HTTPS CORS configuration must remain aligned.
- No live deployment is claimed until provider accounts, database access, deployed URLs, and health/API checks are supplied.
