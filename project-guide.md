# Project Guide: Polly

This document provides a high-level overview of the Polly codebase, architecture, and key technologies used.

## Overview

This is a full-stack polling application built with a modern web development stack. It allows users to register, log in, create polls, vote on them, and view the results. The project leverages Next.js for both frontend rendering and backend API endpoints, with Supabase serving as the database and authentication provider.

## Core Technologies

*   **Framework**: [Next.js](https://nextjs.org/) (using the App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Backend & Database**: [Supabase](https://supabase.com/)
*   **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Project Structure

The codebase is organized to separate concerns and make navigation intuitive.

```
/
├── app/
│   ├── (auth)/         # Authentication pages (login, register)
│   ├── (dashboard)/    # Pages for authenticated users (dashboard, polls)
│   ├── api/            # Backend API routes
│   └── ...
├── components/
│   ├── ui/             # Core UI elements from Shadcn/UI (Button, Card, etc.)
│   ├── polls/          # Components for poll functionality
│   ├── auth/           # Components for authentication forms
│   └── ...
├── lib/
│   ├── actions/        # Server-side functions (Next.js Server Actions)
│   ├── supabase/       # Supabase client initialization and helpers
│   ├── types/          # TypeScript type definitions
│   └── utils.ts        # General utility functions
├── __tests__/
│   └── ...             # Test files for Jest
└── public/
    └── ...             # Static assets (images, icons)
```

### Key Directories Explained

*   **`app/`**: The heart of the application, using the Next.js App Router.
    *   **Route Groups (`(auth)`, `(dashboard)`)**: These organize related pages without affecting the URL structure. For example, `/login` and `/dashboard` are the actual paths.
    *   **`api/`**: This directory contains all backend API routes. For instance, `app/api/polls/route.ts` is the endpoint for handling requests related to polls.

*   **`components/`**: Contains all reusable React components.
    *   **`ui/`**: Holds the low-level, unstyled components from Shadcn/UI.
    *   Feature-based folders like **`polls/`** and **`auth/`** group components by their functionality.

*   **`lib/`**: A central place for shared logic, configurations, and utilities.
    *   **`actions/`**: Contains Next.js Server Actions, which are functions that run on the server and can be called directly from client components, simplifying data mutations.
    *   **`supabase/`**: Manages the connection to the Supabase backend. It provides different clients for use on the server, on the client (browser), and for authentication-protected routes.
    *   **`types/`**: Defines shared TypeScript types and interfaces (e.g., the structure of a `Poll` object) to ensure type safety across the application.

This structure promotes a clean separation between the UI (components), routing/pages (app), and business logic/data (lib).
