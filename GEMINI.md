# Project Overview

This is a web application built with the TanStack ecosystem, including TanStack Router, TanStack Query, and TanStack Store. The frontend is built with React and TypeScript, and styled with Tailwind CSS. The backend is powered by a PostgreSQL database with Drizzle ORM. The project is set up with Vite for building and Vitest for testing.

The application appears to be an events calendar, with features for managing events, categories, and holidays.

# Building and Running

To get the application running locally, follow these steps:

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    The application will be available at `http://localhost:3000`.

3.  **Run tests:**
    ```bash
    pnpm test
    ```

# Development Conventions

*   **Routing:** The project uses file-based routing with TanStack Router. Routes are defined in the `src/routes` directory.
*   **Styling:** Styling is done with Tailwind CSS.
*   **Linting and Formatting:** The project uses Biome for linting and formatting. You can run the linter and formatter with the following commands:
    *   `pnpm lint`
    *   `pnpm format`
    *   `pnpm check`
*   **Database:** The project uses Drizzle ORM for database access. The database schema is defined in `src/db/schema.ts`. Database migrations are managed with `drizzle-kit`.
*   **UI Components:** The project uses Shadcn for UI components.
*   **Environment Variables:** The project uses T3Env for type-safe environment variables. Environment variables are defined in `src/env.ts`.
