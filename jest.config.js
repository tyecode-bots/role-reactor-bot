/**
 * @fileoverview Jest configuration for Role Reactor Bot
 *
 * Configures Jest for testing with ES modules,
 * proper mocking, and coverage reporting.
 *
 * @author Tyecode
 * @version 0.1.0
 * @license MIT
 */

export default {
  // Test environment
  testEnvironment: "node",

  // File extensions to test
  testMatch: ["**/tests/**/*.test.js", "**/tests/**/*.spec.js"],

  // Coverage configuration - disabled for now since tests focus on behavior
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],

  // Coverage thresholds - disabled for now
  // coverageThreshold: {
  //   global: {
  //     branches: 70,
  //     functions: 70,
  //     lines: 70,
  //     statements: 70,
  //   },
  // },

  // Files to collect coverage from
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/index.js", // Exclude main entry point
    "!src/config/**", // Exclude config files
    "!**/node_modules/**",
    "!**/tests/**",
  ],

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],

  // Transform configuration
  transform: {},

  // Globals
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Reset modules between tests
  resetModules: true,
};
