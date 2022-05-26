/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '@Modules/(.*)': '<rootDir>/src/modules/$1',
    '@Shared/(.*)': '<rootDir>/src/shared/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
