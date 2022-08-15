module.exports = {
   verbose: true,
   testEnvironmentOptions:{ url: 'http://localhost/' },
   preset: 'ts-jest',
   testEnvironment: 'jest-environment-jsdom',
   globals: {
      'ts-jest': {
         tsconfig: 'tsconfig.test.json',
      },
   },
   collectCoverage: true,
   collectCoverageFrom: ['src/**/*.{tsx,ts}'],
   coverageReporters: ['json-summary', 'text'],
};
