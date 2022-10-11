const config = {
  verbose: false,
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'https://lascode.space/',
    html: '<html lang=\'en\'><head><title></title></head><body></body></html>',
  },
  setupFiles: [
    '<rootDir>/jest/pointer-event-polyfill.ts',
    '<rootDir>/jest/dom-rect-polyfill.ts',
  ],
};

module.exports = config;
