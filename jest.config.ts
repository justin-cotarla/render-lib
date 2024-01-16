/**
 * For a detailed explanation regarding each configuration property, visit:
 */

import type { Config } from 'jest'

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/math/**/*.ts'],
  prettierPath: null,
}

export default config
