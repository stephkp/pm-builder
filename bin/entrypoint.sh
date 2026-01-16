#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /app/tmp/pids/server.pid

# Wait for PostgreSQL to be ready
echo "== Waiting for PostgreSQL to start..."
until PGPASSWORD=$DATABASE_PASSWORD pg_isready -h "$DATABASE_HOST" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" -t 1; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

# Create the database if it doesn't exist
echo "== Creating database (if it doesn't exist)..."
bundle exec rails db:create 2>/dev/null || echo "Database already exists or could not be created"

# Run migrations
echo "== Running migrations..."
bundle exec rails db:migrate 2>/dev/null || echo "Migrations failed or already run"

# Then exec the container's main process (what's set as CMD in the Dockerfile)
echo "== Starting Rails server..."
exec "$@"