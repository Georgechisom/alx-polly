// __tests__/utils/test-utils.tsx
import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { jest } from "@jest/globals";

// Custom render function with providers if needed
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) =>
  render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });

// Test helper functions
export const mockSupabaseResponse = (data: any = null, error: any = null) => ({
  data,
  error,
  status: error ? 500 : 200,
  statusText: error ? "Internal Server Error" : "OK",
});

export const createMockRequest = (body: any = {}): Partial<Request> => ({
  json: jest.fn().mockResolvedValue(body),
  text: jest.fn().mockResolvedValue(JSON.stringify(body)),
  headers: new Headers(),
  method: "POST",
  url: "http://localhost:3000/api/test",
});

export const createMockNextRequest = (body: any = {}): any => ({
  json: jest.fn().mockResolvedValue(body),
  text: jest.fn().mockResolvedValue(JSON.stringify(body)),
  headers: new Headers(),
  method: "POST",
  url: "http://localhost:3000/api/test",
  nextUrl: {
    pathname: "/api/test",
    searchParams: new URLSearchParams(),
  },
});

export const createMockUser = (overrides: any = {}) => ({
  id: "test-user-id",
  email: "test@example.com",
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockPoll = (overrides: any = {}) => ({
  id: "test-poll-id",
  title: "Test Poll",
  creator_id: "test-user-id",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockPollOption = (overrides: any = {}) => ({
  id: "test-option-id",
  text: "Test Option",
  poll_id: "test-poll-id",
  votes: 0,
  ...overrides,
});

export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Export everything from testing library
export * from "@testing-library/react";
export { customRender as render };

// Add a dummy test to ensure the test suite runs
describe("Test Utils", () => {
  it("should run without errors", () => {
    expect(true).toBe(true);
  });
});
