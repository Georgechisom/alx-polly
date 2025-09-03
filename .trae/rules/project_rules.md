Rules for Alx Polly App

1. General Behavior

Always follow the existing project architecture and conventions.

Prefer clarity over cleverness — write simple, maintainable code.

Never introduce new dependencies unless explicitly requested.

Never expose secrets or hardcode API keys. Use environment variables only.

All timestamps must be in UTC.

2. Code Style

Use TypeScript everywhere (frontend + backend).

Follow ESLint + Prettier rules automatically.

Use camelCase for variables/functions and PascalCase for React components.

Keep functions small and single-responsibility.

Write self-documenting code; add comments only when logic is non-obvious.

3. Frontend Rules

Framework: React + Tailwind + shadcn/ui.

Manage server state with React Query.

Use Context API for app-wide UI state.

Always validate props with TypeScript interfaces.

Prefer composition over prop-drilling.

Components must be accessible (a11y compliant).

4. Backend Rules

Framework: Node.js with Express/NestJS.

Database: PostgreSQL via Prisma ORM.

Never write raw SQL unless explicitly required.

Always validate API inputs with Zod.

Authentication: JWT-based, store passwords with bcrypt.

Separate routes, controllers, and services — follow clean architecture.

5. Domain-Specific Rules (Polly)

A poll must belong to a creator (user).

Poll types: multiple-choice, open-text, rating.

A user can respond only once per poll unless settings allow multiple responses.

Results update in real-time via WebSockets (Socket.io) or SSE.

Polls and responses must be stored with timestamps.

6. Testing

Use Jest for backend + utilities.

Use React Testing Library for frontend.

Every API endpoint must have at least one integration test.

Test poll rules: response uniqueness, poll ownership, and real-time updates.

7. Commit Message Rules

Always follow Conventional Commits:

feat: new feature

fix: bug fix

refactor: code restructuring

test: test changes

docs: documentation updates

//manus, coderabbit, kilo, claude, augment,

Messages must be short, imperative, and descriptive.
