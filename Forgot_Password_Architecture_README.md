# Forgot Password Feature Architecture

## Overview

This document outlines the architecture for implementing a forgot password and password recovery feature in the Next.js application using Supabase for authentication.

## Current Codebase Analysis

- **Framework**: Next.js with App Router
- **Authentication**: Supabase Auth
- **UI**: React with shadcn/ui components
- **Validation**: Zod schemas (already includes `forgotPasswordSchema` and `resetPasswordSchema`)
- **State Management**: React Context for auth state

## Proposed Folder Structure

```
app/
├── (auth)/
│   ├── forgot-password/
│   │   └── page.tsx
│   ├── reset-password/
│   │   └── page.tsx
│   └── layout.tsx (if not exists)
├── api/
│   └── auth/
│       ├── forgot-password/
│       │   └── route.ts
│       └── reset-password/
│           └── route.ts
components/
├── auth/
│   ├── forgot-password-form.tsx
│   └── reset-password-form.tsx
```

## Function Signatures

### API Routes

#### `app/api/auth/forgot-password/route.ts`

```typescript
export async function POST(request: NextRequest): Promise<NextResponse>;
```

**Parameters:**

- `request: NextRequest` - Contains email in JSON body

**Returns:**

- `NextResponse` with success/error status

**Logic:**

1. Parse and validate email from request body
2. Call Supabase `resetPasswordForEmail` with redirect URL
3. Return appropriate response without revealing user existence

#### `app/api/auth/reset-password/route.ts`

```typescript
export async function POST(request: NextRequest): Promise<NextResponse>;
```

**Parameters:**

- `request: NextRequest` - Contains new password and token in JSON body

**Returns:**

- `NextResponse` with success/error status

**Logic:**

1. Extract token from URL search params
2. Validate new password
3. Update password using Supabase auth
4. Return success/error response

### Components

#### `components/auth/forgot-password-form.tsx`

```typescript
export function ForgotPasswordForm(): JSX.Element;
```

**State:**

- `isLoading: boolean`
- `error: string | null`
- `success: string | null`

**Methods:**

- `onSubmit(data: ForgotPasswordInput): Promise<void>` - Handles form submission

#### `components/auth/reset-password-form.tsx`

```typescript
export function ResetPasswordForm(): JSX.Element;
```

**State:**

- `isLoading: boolean`
- `error: string | null`

**Methods:**

- `onSubmit(data: ResetPasswordInput): Promise<void>` - Handles password update

### Pages

#### `app/(auth)/forgot-password/page.tsx`

```typescript
export default function ForgotPasswordPage(): JSX.Element;
```

**Features:**

- Renders `ForgotPasswordForm`
- Provides navigation links to login/register

#### `app/(auth)/reset-password/page.tsx`

```typescript
export default function ResetPasswordPage(): JSX.Element;
```

**Features:**

- Extracts token from URL
- Renders `ResetPasswordForm`
- Handles token validation

## Security Considerations

### 1. Rate Limiting

- Implement rate limiting on forgot password endpoint (e.g., 5 requests per hour per IP)
- Use middleware or service like Upstash Rate Limit

### 2. Token Security

- Password reset tokens should have short expiration (15-30 minutes)
- Tokens should be single-use
- Validate tokens server-side before allowing password change

### 3. Information Disclosure

- Never reveal whether an email exists in the system
- Return generic success message for forgot password requests
- Log security events for monitoring

### 4. Password Requirements

- Enforce strong password policies (already implemented in schema)
- Prevent reuse of recent passwords (if implemented)
- Hash passwords securely (handled by Supabase)

### 5. HTTPS Enforcement

- Ensure all auth flows use HTTPS
- Set secure cookies for session management

### 6. CSRF Protection

- Implement CSRF tokens for state-changing operations
- Use Next.js built-in protections

### 7. Audit Logging

- Log all password reset attempts
- Monitor for suspicious patterns
- Alert on multiple failed attempts

## Performance Considerations

### 1. Database Optimization

- Use database indexes on email fields
- Implement connection pooling for Supabase

### 2. Caching

- Cache user lookup results (with short TTL)
- Use Redis for rate limiting data

### 3. Email Delivery

- Use background job queue for email sending
- Implement retry logic for failed deliveries
- Monitor email bounce rates

### 4. Frontend Optimization

- Lazy load auth components
- Implement proper loading states
- Use optimistic updates where appropriate

## Implementation Steps

1. **Create API Routes**

   - Implement forgot password endpoint with rate limiting
   - Implement reset password endpoint with token validation

2. **Create Components**

   - Build forgot password form with validation
   - Build reset password form with strength indicator

3. **Create Pages**

   - Add forgot password page with proper routing
   - Add reset password page with token handling

4. **Update Existing Components**

   - Add "Forgot Password?" link to login form
   - Update navigation between auth pages

5. **Add Security Middleware**

   - Implement rate limiting middleware
   - Add CSRF protection

6. **Testing**

   - Unit tests for components and utilities
   - Integration tests for API routes
   - End-to-end tests for complete flow

7. **Monitoring**
   - Add logging for security events
   - Set up alerts for suspicious activity
   - Monitor performance metrics

## Error Handling

### Client-side Errors

- Form validation errors
- Network errors
- Invalid token errors

### Server-side Errors

- Invalid email format
- Rate limit exceeded
- Token expired
- Password policy violations

### User Experience

- Clear error messages
- Loading states
- Success confirmations
- Proper redirects after actions

## Dependencies

### New Dependencies (if needed)

- `@upstash/rate-limit` for rate limiting
- `bcryptjs` for additional password hashing (if not using Supabase)
- `@types/bcryptjs` for TypeScript support

### Existing Dependencies

- `@supabase/supabase-js`
- `zod`
- `react-hook-form`
- `@hookform/resolvers`
- `next/navigation`

## Testing Strategy

### Unit Tests

- Component rendering and interactions
- Form validation logic
- API route handlers

### Integration Tests

- Complete forgot password flow
- Email sending verification
- Database state changes

### E2E Tests

- User journey from login to password reset
- Email link clicking and form submission
- Error scenarios and edge cases

## Deployment Considerations

1. **Environment Variables**

   - Ensure Supabase credentials are set
   - Configure email service settings
   - Set rate limiting thresholds

2. **Database Migrations**

   - No schema changes required (using Supabase auth)
   - Ensure proper RLS policies if custom tables used

3. **CDN/Edge Functions**

   - Consider using Supabase Edge Functions for API routes
   - Implement proper CORS policies

4. **Monitoring**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor auth-related metrics
   - Alert on security incidents
