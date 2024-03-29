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
  // numTestsKeptInMemory: 0,
  // blockHosts: [ 
  //   "*.adobedtm.com",
  //   "*.googleadservices.com"
  // ],
  retries: {
    runMode: 2,
    openMode: 0,
  },
  userAgent: 'Cypress',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      config.env.ENV = process.env.ENV || 'production';
      console.log(`Cypress running in ${config.env.ENV} environment`);
      const environmentConfig = require(`./cypress/plugins/config/${config.env.ENV}.json`);
      // const getCompareSnapshotsPlugin = require('cypress-image-diff-js/dist/plugin');
      // getCompareSnapshotsPlugin(on, config);
      return {
        ...config,
        ...environmentConfig,
      };
    },
  },
});


  