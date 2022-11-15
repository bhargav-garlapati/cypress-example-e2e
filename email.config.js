const { defineConfig } = require("cypress");

module.exports = defineConfig({
//   projectId: "",
  userAgent: "Cypress",
  e2e: {
    supportFile: false,
    setupNodeEvents(on, config) {
      if (process.env.EMAIL_TO) {
        require("cypress-email-results")(on, config, {
          email: process.env.EMAIL_TO,
        });
      }
      return config;
    },
  },
});