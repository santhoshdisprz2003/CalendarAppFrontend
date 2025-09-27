// This file extends the default Create React App Jest configuration
module.exports = {
  // Use the default CRA preset
  preset: 'react-scripts',
  
  // Collect coverage from all source files
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/setupTests.js'
  ],
  
  // Set coverage thresholds if desired
  coverageThresholds: {
    global: {
      statements: 50,
      branches: 50,
      functions: 50,
      lines: 50,
    },
  },
  
  // Test environment setup
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
