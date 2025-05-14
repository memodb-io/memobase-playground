<div align="center">
  <h1>Memobase Playground</h1>
  <p>
    	<img src="https://img.shields.io/badge/Memobase-Playground-blue">
      <img src="https://img.shields.io/badge/license-MIT-green">
  </p>
  <p>
    <a href="https://app.memobase.io/playground" > 
    	<img style="border-radius: 12px; width: 700px;" src="https://github.com/user-attachments/assets/f9431519-4693-43df-aaaa-560d8f531de7">
    </a>
  </p>
</div>



A playground project based on the open-source [Memobase](https://github.com/memodb-io/memobase) project, built with Supabase as the backend database.


## Overview

This project is a playground environment for experimenting with and extending the Memobase functionality. It provides a simplified setup for development and testing purposes.

## ✨ Features

### 🤖 AI-Powered Assistant
- Interactive chat interface with AI assistant
- Smart suggestions for conversation starters
- Contextual memory of user interactions
- Support for multiple message formats

### 👤 User Management
- Secure authentication system
- Social login with Google and GitHub
- Anonymous access support
- JWT-based token management
- Refresh token functionality

### 💬 Thread Management
- Create and manage conversation threads
- Archive/unarchive threads
- Thread-based message organization
- Real-time message updates

### 🌐 Internationalization
- Multi-language support (English, Chinese)
- Dynamic language switching
- Localized UI components
- RTL support ready

### 🎨 Modern UI/UX
- Responsive design
- Dark/Light theme support
- Beautiful timeline visualization
- Interactive components
- Toast notifications
- Loading states and animations

### 🔒 Security
- Secure token management
- Environment variable configuration
- Protected API routes
- Rate limiting support

### 🚀 Performance
- Next.js 15 with Turbopack
- Cloudflare deployment support
- Optimized asset loading
- Incremental static regeneration

### 📱 Mobile Ready
- Responsive design
- Touch-friendly interface
- Mobile-optimized components
- Cross-device compatibility

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Supabase
- **AI Integration**: OpenAI
- **Authentication**: JWT, OAuth
- **Deployment**: Cloudflare
- **Package Manager**: pnpm
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Styling**: TailwindCSS, CSS Variables



## Getting Started

1. Clone the repository
2. Set up your Supabase project
3. Run the database creation scripts
4. Configure your environment variables
5. Start the development server

## Environment Setup

The project includes an `.env.example` file with the following variables that you should configure:

```env
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_PATH="/playground"

OPENAI_API_KEY=""          # Your OpenAI API key
OPENAI_BASE_URL=""         # OpenAI API base URL (optional)
OPENAI_MODEL=""            # OpenAI model to use (e.g., "gpt-3.5-turbo")

NEXT_PUBLIC_SUPABASE_URL=""        # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=""   # Your Supabase anonymous key

NEXT_PUBLIC_MEMOBASE_PROJECT_URL="" # Memobase project URL (if connecting to Memobase)
NEXT_PUBLIC_MEMOBASE_API_KEY=""     # Memobase API key (if connecting to Memobase)
```

Copy the `.env.example` file to `.env` and fill in the required values for your environment.

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

### Database Functions
<details>

<summary>Click to expand</summary>

```sql
CREATE OR REPLACE FUNCTION public.get_threads_for_user(uid uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  RETURN (
    SELECT json_build_object(
      'threads', COALESCE(json_agg(t), '[]'::json)
    )
    FROM (
      SELECT *
      FROM threads
      WHERE created_by = uid AND is_archived = false
      ORDER BY created_at DESC
    ) t
  );
END;$function$

CREATE OR REPLACE FUNCTION public.create_thread(uid uuid, last_message_at timestamp with time zone)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  thread_id UUID;
BEGIN
  INSERT INTO threads (
    id,
    workspace_id,
    created_by,
    updated_by,
    title,
    last_message_at
  )
  VALUES (
    uuid_generate_v4(),
    'workspace',
    uid,
    uid,
    '',
    last_message_at
  )
  RETURNING id INTO thread_id;

  RETURN json_build_object('thread_id', thread_id);
END;$function$

CREATE OR REPLACE FUNCTION public.update_thread_archived(uid uuid, thread_id uuid, archived boolean)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  UPDATE threads
  SET
    is_archived = archived,
    updated_by = uid,
    updated_at = now()
  WHERE id = thread_id
    AND created_by = uid;

  RETURN json_build_object();
END;$function$

CREATE OR REPLACE FUNCTION public.get_messages_by_thread_and_user(uid uuid, tid uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  RETURN (
    WITH message_data AS (
      SELECT
        m.id,
        m.parent_id,
        m.thread_id,
        m.created_by,
        m.created_at,
        m.updated_by,
        m.updated_at,
        m.format,
        m.content,
        m.height
      FROM
        messages m
      WHERE
        m.thread_id = tid
        AND m.created_by = uid
      ORDER BY
        m.created_at DESC
    )
    SELECT json_build_object(
      'messages', COALESCE(json_agg(message_data), '[]'::json)
    )
    FROM message_data
  );
END;$function$

CREATE OR REPLACE FUNCTION public.create_message(uid uuid, tid uuid, pid uuid, fmt character varying, c json)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  mid UUID;
BEGIN
  INSERT INTO messages (
    id,
    thread_id,
    parent_id,
    created_by,
    updated_by,
    content,
    format,
    created_at,
    updated_at
  )
  VALUES (
    uuid_generate_v4(),
    tid,
    pid,
    uid,
    uid,
    c,
    fmt,
    now(),
    now()
  )
  RETURNING id INTO mid;

  RETURN json_build_object(
    'message_id', mid
  );
END;$function$

CREATE OR REPLACE FUNCTION public.get_message_count_by_uid(uid uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
    message_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO message_count
    FROM messages
    WHERE created_by = uid
        AND created_at >= date_trunc('day', now());

    RETURN message_count;
END;$function$
```

</details>
