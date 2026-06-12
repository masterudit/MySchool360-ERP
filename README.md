# MySchool ERP

MySchool ERP is a secure, tenant-aware school management system. The repository is organized so the frontend and future backend can evolve independently.

## Repository Structure

```text
MySchoolERP/
├── frontend/               React, TypeScript, Vite, TailAdmin
├── school-erp-mvp-plan.md  Product and delivery plan
└── README.md
```

The backend is intentionally not created yet. Although separately deployable services may be introduced later, the MVP plan recommends beginning with a modular Spring Boot application so business boundaries can mature before paying the operational cost of microservices.

## Frontend Stack

- React 19 and TypeScript
- Vite
- TailAdmin free React theme and Tailwind CSS 4
- React Router
- TanStack Query and Axios
- React Hook Form and Zod

TailAdmin is MIT licensed. Its license is retained in `frontend/LICENSE.md`.

## Run Locally

Requirements: Node.js 20 or later and npm.

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:5173/login`.

Useful checks:

```bash
npm run lint
npm run build
```

## Frontend Architecture

```text
frontend/src/
├── components/      Shared, reusable UI primitives
├── config/          Validated environment configuration
├── context/         Cross-application React contexts
├── features/        Business features with their own API, UI, hooks, schemas, and types
│   └── auth/
├── icons/           TailAdmin SVG icon set
└── lib/             Shared infrastructure such as API and query clients
```

New business capabilities should normally live under `features/<feature-name>`. Keep feature-specific code inside its feature and move a component into `components` only when it is genuinely shared.

## Authentication Contract

The login form is wired for:

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "name@school.edu",
  "password": "...",
  "rememberMe": false
}
```

The API base URL is configured through `VITE_API_BASE_URL`.

## Security Guidelines

- Do not implement reversible password encryption in the browser. Send credentials only over HTTPS and hash passwords on the backend using Argon2id or bcrypt.
- Prefer secure, `HttpOnly`, `SameSite` cookies for sessions. The Axios client already sends credentials with cross-origin API requests.
- Never place secrets in `VITE_*` variables; Vite embeds them in the browser bundle.
- Validate authorization, roles, permissions, and `school_id` tenant boundaries on the backend for every request.
- Do not store access tokens, passwords, or sensitive student data in `localStorage`.
- Apply rate limiting, audit logging, CSRF protection where applicable, secure headers, and short-lived sessions on the backend.
- Client-side validation improves usability but never replaces backend validation.

## Current Scope

- Vite frontend setup
- TailAdmin free theme foundation
- Responsive, dark-mode-capable login page
- Typed login API integration
- Form validation and reusable frontend structure
