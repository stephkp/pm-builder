# pm-builder-new

Rails 7 + PostgreSQL backend with a Vite/React frontend located in `frontend/`.

## Quickstart (recommended): Docker

### Prerequisites

- Docker Desktop

### Start services

```bash
docker compose up --build
```

This starts:

- `db` (Postgres) on `localhost:5432`
- `app` (Rails) on `localhost:3000`
- `frontend` (Vite) on `localhost:5173`

### First-time database setup

In a separate terminal:

```bash
docker compose exec app bundle exec rails db:prepare
```

If you need to reset the DB later:

```bash
docker compose exec app bundle exec rails db:drop db:create db:migrate
```

### URLs

- Rails: `http://localhost:3000`
- Frontend (Vite): `http://localhost:5173`

## Local development (no Docker)

### Backend (Rails)

#### Prerequisites

- Ruby `2.7.8` (see `Gemfile`)
- Bundler (Docker uses `2.3.26`)
- PostgreSQL

#### Install gems

```bash
bundle install
```

#### Configure database

`config/database.yml` expects the following environment variables:

- `DATABASE_HOST` (e.g. `localhost`)
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `DATABASE_NAME` (optional; defaults to `pm_builder_development`)

#### Create/migrate DB and run Rails

```bash
bundle exec rails db:prepare
bundle exec rails s
```

### Frontend (Vite + React)

From `frontend/`:

```bash
yarn install
yarn dev
```

## Troubleshooting

### "Database not configured" / connection errors locally

Make sure `DATABASE_HOST`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD` are set.

### Frontend can’t reach backend locally

When running Docker, Vite proxies API calls to `http://app:3000`.
If running everything locally (no Docker), you may need to update the Vite proxy target in `frontend/vite.config.js` to `http://localhost:3000`.
