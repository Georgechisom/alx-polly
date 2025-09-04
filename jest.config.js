// jest.config.js
const nextJest = require("next/jest.js");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
});

// Add any custom config to be passed to Jest
const config = {
  coverageProvider: "v8",
  testEnvironment: "node",

  // Setup files after environment is set up
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Module name mapping for path aliases
  moduleNameMapper: {
    // Handle module aliases (these should match your tsconfig.json paths)
    "^@/(.*)$": "<rootDir>/$1",
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "^@/app/(.*)$": "<rootDir>/app/$1",
    "^@/utils/(.*)$": "<rootDir>/utils/$1",

    // Handle CSS imports (with CSS modules)
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

    // Handle CSS imports (without CSS modules)
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

    // Handle image imports
    "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$":
      "<rootDir>/__mocks__/fileMock.js",
  },

  // Test match patterns
  testMatch: [
    "<rootDir>/**/__tests__/**/*.(ts|tsx|js|jsx)",
    "<rootDir>/**/*.(test|spec).(ts|tsx|js|jsx)",
  ],

  // Transform configuration
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },

  // Ignore patterns
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],

  // Collection coverage from these files
  collectCoverageFrom: [
    "app/**/*.{js,ts,tsx}",
    "components/**/*.{js,ts,tsx}",
    "lib/**/*.{js,ts}",
    "utils/**/*.{js,ts}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);
