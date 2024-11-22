/**
 * getOpts - get the options for staging environments
 *
 * NOTE: A `CYPRESS_CREDENTIALS` environment variable must be defined
 * (locally or in docker/server environment)
 *
 * @returns object - an empty object or object with username and password
 */

// const compareSnapshotCommand = require("cypress-image-diff-js/dist/command");
// compareSnapshotCommand({ disableTimersAndAnimations: false });

const getStagingOpts = () => {
    const opts = {};
    const username = Cypress.env("BASIC_AUTH_USERNAME");
    const password = Cypress.env("BASIC_AUTH_PASSWORD");
    opts.auth = {
      username,
      password,
    };
    opts.headers = {
      "Accept-Encoding": "gzip, deflate",
    };
    return opts;
  };
  
  /**
   * getSessionToken - retrieves a new sessionTokens
   *
   * @returns string - session token
   */
  
  Cypress.Commands.add("visitPage", (path, opts = {}) => {
    console.log(`${Cypress.env("CREDENTIALS")}`);
    cy.visit(`${Cypress.config().baseUrl}${path}`, getStagingOpts());
  });
  
  Cypress.Commands.add("isNotInViewport", (element) => {
    cy.get(element).then(($el) => {
      const bottom = Cypress.$(cy.state("window")).height();
      const rect = $el[0].getBoundingClientRect();
  
      expect(rect.top).to.be.greaterThan(bottom);
      expect(rect.bottom).to.be.greaterThan(bottom);
      expect(rect.top).to.be.greaterThan(bottom);
      expect(rect.bottom).to.be.greaterThan(bottom);
    });
  });
  
  Cypress.Commands.add("isInViewport", (element) => {
    cy.get(element).then(($el) => {
      const bottom = Cypress.$(cy.state("window")).height();
      const rect = $el[0].getBoundingClientRect();
  
      expect(rect.top).not.to.be.greaterThan(bottom);
      expect(rect.bottom).not.to.be.greaterThan(bottom);
      expect(rect.top).not.to.be.greaterThan(bottom);
      expect(rect.bottom).not.to.be.greaterThan(bottom);
    });
  });

  Cypress.Commands.add("getByID", (selector, ...args) => {
    return cy.get(`[id=${selector}]`, ...args);
  });
  
  // Sending locators to the iframe
  Cypress.Commands.add("sendToiframeLocator", (iframeId, cssLocator, value) => {
    // Check if the iframe exists and is loaded
    cy.get(`iframe${iframeId}`).should('exist');
    cy.frameLoaded(`iframe${iframeId}`);
    cy.iframe(`iframe${iframeId}`)
      .find(cssLocator)
      .type(value, { force: true, log: false, delay: 100 });
    cy.get('body').click(); // click outside the iframe
    cy.wait(1000);
  });