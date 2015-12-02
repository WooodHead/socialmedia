exports.config = {
  framework: 'jasmine',
  directConnect: true,
  specs: ['test/client/**/*.js'],
  capabilities: {
    browserName: 'firefox'
  }
};
