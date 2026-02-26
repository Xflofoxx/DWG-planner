module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/database.js'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true,
  testTimeout: 10000,
  moduleNameMapper: {
    '^../config/database$': '<rootDir>/tests/__mocks__/database.js',
    '^../config/database': '<rootDir>/tests/__mocks__/database.js',
    '^uuid$': '<rootDir>/tests/__mocks__/uuid.js'
  }
};