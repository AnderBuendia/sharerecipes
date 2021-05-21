module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/'],
  moduleNameMapper: {
    '\\.(scss|sass|css)$': 'identity-obj-proxy',
    '@Components/(.*)': '<rootDir>/src/components/$1',
    '@Enums/(.*)': '<rootDir>/src/enums/$1',
    '@Interfaces/(.*)': '<rootDir>/src/interfaces/$1',
    '@Lib/(.*)': '<rootDir>/src/lib/$1',
    '@Pages/(.*)': '<rootDir>/src/pages/$1',
  },
};
