# Threat Model

## Project Overview

This project is a pnpm monorepo for the Business & Finance Society (B&FS) website. Production-relevant code consists of a public React + Vite frontend in `artifacts/bfs-website` and an Express 5 API in `artifacts/api-server`. The API exposes public event reads, admin authentication, event-management writes, and object-storage upload/serving endpoints. Data is stored in PostgreSQL via Drizzle ORM, and uploaded files are stored through Replit-managed object storage / Google Cloud Storage.

Per deployment assumptions, only production-reachable code is in scope. `artifacts/mockup-sandbox` is a dev-only sandbox and should be ignored unless future scans show it is production-reachable.

## Assets

- **Admin session and admin password** — the application has a single privileged admin interface at `/admin`, authenticated by a shared password and an `admin_session` JWT cookie. Compromise allows modification of event content and uploaded assets.
- **Event data** — titles, dates, descriptions, status, category, and image URLs stored in PostgreSQL. Integrity matters because the public website renders this content to visitors.
- **Uploaded event media and object paths** — event photos are uploaded through presigned URLs and then served from the application origin. These objects can become a vehicle for content spoofing, stored XSS, or unwanted public disclosure if access rules are too broad.
- **Application secrets** — `ADMIN_PASSWORD`, `JWT_SECRET`, `DATABASE_URL`, `PRIVATE_OBJECT_DIR`, and object-storage configuration. Compromise would allow admin impersonation or backend/data access.

## Trust Boundaries

- **Browser to API** — all client requests cross from an untrusted browser into the Express API. The API must treat all request bodies, params, cookies, and headers as attacker-controlled.
- **Public visitor to admin-only API** — `GET /api/events` and some object-serving routes are public, while login, event mutations, and upload initiation are admin-gated. This boundary must be enforced server-side.
- **API to PostgreSQL** — the API has direct write access to the event table. Input validation and parameterized ORM usage are required to preserve data integrity.
- **API to object storage** — the API signs uploads and proxies object reads. File type, size, path scope, and public/private access decisions are security-relevant at this boundary.
- **Production vs dev-only artifacts** — `artifacts/bfs-website` and `artifacts/api-server` are production surfaces. `artifacts/mockup-sandbox` is dev-only and out of scope unless evidence later shows it is shipped in production.

## Scan Anchors

- **Production entry points**
  - `artifacts/bfs-website/src/main.tsx`
  - `artifacts/api-server/src/index.ts`
  - `artifacts/api-server/src/routes/*.ts`
- **Highest-risk code areas**
  - `artifacts/api-server/src/routes/auth.ts`
  - `artifacts/api-server/src/routes/events.ts`
  - `artifacts/api-server/src/routes/storage.ts`
  - `artifacts/api-server/src/lib/objectStorage.ts`
  - `artifacts/bfs-website/src/pages/admin.tsx`
- **Public surfaces**
  - public website routes
  - `GET /api/events`
  - object-serving endpoints that intentionally expose media
- **Authenticated/admin surfaces**
  - `/admin`
  - `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/check`
  - `POST|PUT|DELETE /api/events*`
  - `POST /api/storage/uploads/request-url`
- **Usually ignore unless production reachability changes**
  - `artifacts/mockup-sandbox/**`

## Threat Categories

### Spoofing

The main spoofing risk is impersonating the single admin user. All privileged routes must require a valid, signed `admin_session` cookie, and the server must never trust frontend state alone. JWT signing keys must remain secret, cookies must stay `httpOnly`, `secure` in production, and authentication responses must not weaken the login boundary.

### Tampering

Attackers may try to alter event data, file metadata, or storage paths. Event creation and updates must validate request bodies server-side, and privileged mutations must remain admin-only. Upload initiation must not allow attackers to turn an event-photo feature into arbitrary same-origin content hosting or unrestricted object creation outside the intended media scope.

### Information Disclosure

Public routes should only expose event data and media intentionally meant for visitors. The application must not expose internal storage objects merely because their path is known, leak secrets or stack traces in responses, or broaden access beyond the event-media paths that are intended to be public.

### Denial of Service

The login route already has rate limiting, but public or upload-related endpoints must not allow unbounded work or storage consumption. File uploads should be constrained by type and reasonable size, and external/storage calls should use timeouts and avoid attacker-controlled amplification.

### Elevation of Privilege

The critical privilege boundary is between public visitors and the admin event-management surface. The server must enforce authorization for all mutations, avoid broad object-serving logic that bypasses intended privacy boundaries, and prevent uploaded content from becoming an execution or privilege-escalation vector under the site origin.
