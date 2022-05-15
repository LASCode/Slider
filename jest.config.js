const config = {
  verbose: false,
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'https://lascode.space/',
    html: '<html lang=\'en\'><head><title></title></head><body></body></html>',
  },
  setupFiles: [
    '<rootDir>/jest/PointerEventPolyfill.ts',
    '<rootDir>/jest/DOMRectPolyfill.ts',
  ],
};

module.exports = config;
