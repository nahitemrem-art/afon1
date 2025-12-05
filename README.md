# Project Database

SQLite database implementation for the project.

## Setup

### Installation

Install dependencies:

```bash
npm install
```

### Initialize Database

Initialize the SQLite database with the schema:

```bash
npm run db:init
```

This will create the `data/database.sqlite` file and initialize all tables as defined in `db/schema.sql`.

### Running Migrations

Run database migrations:

```bash
npm run migrate
```

Migrations are stored in `db/migrations/` directory and are tracked in the `migrations` table.

## Database Schema

### Tables

#### users
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT)
- `email` (TEXT UNIQUE)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

#### sessions
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER FOREIGN KEY)
- `token` (TEXT UNIQUE)
- `expires_at` (DATETIME)
- `created_at` (DATETIME)

### Indexes

Indexes are created for:
- `users.email`
- `sessions.user_id`
- `sessions.token`
- `sessions.expires_at`

## Creating Migrations

Add new migration files to `db/migrations/` directory with `.sql` extension. Migration files will be automatically executed in alphabetical order.

Example migration file: `db/migrations/001_add_users_table.sql`

```sql
-- Migration description
CREATE TABLE new_feature (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ...
);
```
