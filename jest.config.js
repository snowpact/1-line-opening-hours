module.exports = {
  moduleFileExtensions: ['js', 'ts', 'json'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/?(*.)+(spec|test).ts?(x)',
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
