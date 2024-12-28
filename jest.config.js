module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};