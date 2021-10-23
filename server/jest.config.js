/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '@Models/(.*)': '<rootDir>/src/models/$1',
    '@Enums/(.*)': '<rootDir>/src/enums/$1',
    '@DB/(.*)': '<rootDir>/src/db/$1',
    '@Routes/(.*)': '<rootDir>/src/routes/$1',
    '@Graphql/(.*)': '<rootDir>/src/graphql/$1',
    '@Middleware/(.*)': '<rootDir>/src/middleware/$1',
    '@Utils/(.*)': '<rootDir>/src/utils/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
