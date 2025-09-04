// jest.setup.js

// Add TextEncoder/TextDecoder polyfills FIRST before any imports
const { TextEncoder, TextDecoder } = require("util");

// @ts-expect-error - Adding polyfills to global
global.TextEncoder = TextEncoder;
// @ts-expect-error - Adding polyfills to global
global.TextDecoder = TextDecoder;

// Add undici polyfills for Web API support in Node environment
const { fetch, Request, Response, Headers, FormData } = require("undici");

// @ts-expect-error - Adding polyfills to global
global.fetch = fetch;
// @ts-expect-error - Adding polyfills to global
global.Request = Request;
// @ts-expect-error - Adding polyfills to global
global.Response = Response;
// @ts-expect-error - Adding polyfills to global
global.Headers = Headers;
// @ts-expect-error - Adding polyfills to global
global.FormData = FormData;

// Also polyfill ReadableStream for tests
const { ReadableStream } = require("stream/web");
// @ts-expect-error - Adding polyfills to global
global.ReadableStream = ReadableStream;

import "@testing-library/jest-dom";

// Mock window.matchMedia (only if window exists - for jsdom environment)
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

// Suppress console errors in tests unless needed
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
