export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts','js','json'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
};
