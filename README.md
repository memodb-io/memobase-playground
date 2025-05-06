https://github.com/user-attachments/assets/f9431519-4693-43df-aaaa-560d8f531de7

# Memobase Playground

A playground project based on the open-source [Memobase](https://github.com/memodb-io/memobase) project, built with Supabase as the backend database.

## Overview

This project is a playground environment for experimenting with and extending the Memobase functionality. It provides a simplified setup for development and testing purposes.

## Database Setup

The project uses Supabase as its database backend. Below are the SQL statements to create the necessary tables:

### Messages Table
```sql
CREATE TABLE "public"."messages" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "parent_id" uuid,
    "thread_id" uuid NOT NULL,
    "created_by" uuid NOT NULL,
    "updated_by" uuid NOT NULL,
    "format" text NOT NULL,
    "content" text NOT NULL,
    "height" integer,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now()
);
```

### Threads Table
```sql
CREATE TABLE "public"."threads" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" text NOT NULL,
    "updated_by" uuid NOT NULL,
    "title" text,
    "is_archived" boolean NOT NULL DEFAULT false,
    "external_id" text,
    "metadata" jsonb,
    "created_by" uuid NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "last_message_at" timestamptz
);
```

## Getting Started

1. Clone the repository
2. Set up your Supabase project
3. Run the database creation scripts
4. Configure your environment variables
5. Start the development server

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Available Scripts

This project uses pnpm as the package manager. Here are the available scripts:

```bash
# Install dependencies
pnpm install

# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Preview Cloudflare deployment locally
pnpm preview

# Deploy to Cloudflare
pnpm deploy

# Upload to Cloudflare
pnpm upload

# Generate Cloudflare environment types
pnpm cf-typegen
```

## Development

This is a playground project, so feel free to experiment and modify the codebase as needed. The project structure follows the original Memobase architecture but with simplified components for easier development and testing.

## Contributing

Since this is a playground project, contributions are welcome but not actively maintained. Feel free to fork and modify for your own needs.

## License

This project is based on Memobase and follows its original license. Please refer to the original Memobase repository for license details.
