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
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      // on task event to log messages is required for the @lambdatest/cypress-driver plugin to work
      on('task', {
        log(message) {
            console.log(message);
            return null;
        },
      });
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