const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'rgy1pi',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  chromeWebSecurity: false,
  viewportHeight: 800,
  viewportWidth: 1280,
  numTestsKeptInMemory: 0,
  // blockHosts: [ 
  //   '*.google-analytics.com',
  // ],
  // env: {
  // },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  userAgent: 'Cypress',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
  },
})



  