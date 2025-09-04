# Next.js Polling App Cleanup Inventory

## Tech Stack & Versions

- **Framework**: Next.js 15.5.2 (App Router)
- **React**: 19.1.0
- **TypeScript**: 5.6.3
- **Database**: Supabase (@supabase/supabase-js 2.56.0, @supabase/ssr 0.7.0)
- **Testing**: Jest 29.7.0 with @testing-library/react 16.3.0
- **Styling**: Tailwind CSS 4
- **Validation**: Zod 4.1.5

## Test Framework & Config

- **Primary**: Jest with next/jest configuration
- **Environment**: jsdom (needs node environment for route handlers)
- **Setup**: jest.setup.js with basic mocks
- **Missing**: undici polyfills for Web API support in Node tests

## Critical Issues Identified

### 🚨 BROKEN CODE (High Priority)

#### 1. Mixed Test/Route Code

- **File**: `app/api/polls/route.ts` lines 4-10
- **Issue**: Test code embedded inside route handler file
- **Status**: BROKEN - will cause runtime errors

#### 2. Circular Import in route.ts

- **File**: `app/api/polls/route.ts` line 4
- **Issue**: `import { getPollsData } from "./route";` imports from itself
- **Status**: BROKEN - will cause module resolution errors

#### 3. Wrong Import in Tests

- **File**: `lib/actions/poll-actions.test.ts` line 2
- **Issue**: Imports from `../supabase/client` which doesn't export `supabase`
- **Status**: BROKEN - test will fail to run

#### 4. Database Table Inconsistency

- **Files**: Multiple locations
- **Issue**: Some code uses "options" table, others use "poll_options"
- **Status**: BROKEN - will cause database errors

### 🧹 DUPLICATES & DEAD CODE

#### 1. Duplicate Supabase Clients

- **Files**: `lib/supabase/client.ts` and `lib/supabase/server-client.ts`
- **Issue**: Both files have overlapping `createRouteClient` functions
- **Impact**: Confusion and potential import errors

#### 2. Duplicate Route Files

- **Files**: `app/api/polls/route.ts` and `app/api/polls/route-before.ts`
- **Status**: Keep \*-before.ts as specified, cleanup current route.ts

#### 3. Mock Data Functions

- **File**: `app/api/polls/route.ts`
- **Issue**: `getPollsData()` returns mock data instead of real data
- **Status**: Remove mock implementation

### 🔧 TEST ENVIRONMENT ISSUES

#### 1. Missing Web API Polyfills

- **Need**: undici polyfills for Request/Response/fetch in Node environment
- **Files**: jest.setup.js needs updating

#### 2. Wrong Test Environment

- **Issue**: Using jsdom for route handler tests (should be node)
- **Impact**: Route handlers may not test correctly

#### 3. Incomplete Supabase Mocking

- **Files**: `__mocks__/@supabase/supabase-js.js`
- **Issue**: Mock doesn't match actual Supabase client structure

### 🏗️ BROKEN IMPORTS & MISSING DEPS

#### 1. Async/Await Issues

- **File**: `lib/supabase/server-client.ts`
- **Issue**: Functions marked async but cookies() call may need await
- **Status**: Inconsistent with other files

#### 2. Missing Server Import

- **File**: `lib/supabase/utils.ts` line 1
- **Issue**: Imports from "@/lib/supabase/server" which doesn't exist
- **Should be**: "@/lib/supabase/server-client"

### 📝 CONSOLE/DEBUG LEFTOVERS

- Multiple `console.error` statements throughout route handlers
- TODO comments in route-before.ts that are no longer needed

## Cleanup Action Plan

### Phase 1: Critical Fixes

1. ✅ Fix route.ts - remove test code and circular import
2. ✅ Fix import paths in utils.ts and poll-actions.test.ts
3. ✅ Standardize database table names to "poll_options"
4. ✅ Fix async/await consistency in Supabase clients

### Phase 2: Test Environment

1. ✅ Add undici polyfills to jest.setup.js
2. ✅ Configure Jest for node environment for API routes
3. ✅ Fix Supabase mocking structure

### Phase 3: Code Cleanup

1. ✅ Remove duplicate/dead code
2. ✅ Consolidate Supabase client files
3. ✅ Remove debug console statements
4. ✅ Clean up mock data functions

### Phase 4: Validation

1. ✅ Run tests to ensure 0 failures
2. ✅ Test dev server with core flows
3. ✅ Verify no runtime errors

## Expected Test Failures (Before Fix)

- route.ts test import errors
- poll-actions.test.ts import errors
- Database table name mismatches
- Missing Web API polyfills in Node environment
