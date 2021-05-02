module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'jsdom',
   globals: {
      'ts-jest': {
         tsconfig: 'tsconfig.test.json',
      },
   },
   collectCoverage: true,
   collectCoverageFrom: ['src/**/*.{tsx,ts}'],
   coverageReporters: ['json-summary', 'text'],
};
