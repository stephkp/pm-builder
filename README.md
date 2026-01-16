# pm-builder-new

Rails 7 + PostgreSQL backend with a Vite/React frontend

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

## Troubleshooting

### "Database not configured" / connection errors locally

Make sure `DATABASE_HOST`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD` are set.
