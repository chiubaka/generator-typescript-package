import type { Config } from "jest";

const config: Config = {
  coverageDirectory: "<rootDir>/reports/coverage",
  preset: "ts-jest",
  setupFilesAfterEnv: ["./src/__tests__/__setup__/jest.setup.ts"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["/__tests__/(__setup__|__fixtures__)/*"],
};

export default config;
