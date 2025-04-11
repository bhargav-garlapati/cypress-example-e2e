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
Cypress.Commands.add("iframeLocator", (iframeId, cssLocator, value) => {
  // Ensure iframe exists and is loaded
  cy.get(`iframe${iframeId}`).should('exist');
  cy.frameLoaded(`iframe${iframeId}`);

  // Interact with the iframe's content
  cy.iframe(`iframe${iframeId}`)
    .find(cssLocator)
    .click();

  // If needed, you can use .contains() instead to find specific text
  // cy.iframe(`iframe${iframeId}`).find(cssLocator)
  //   .contains(value, { force: true, log: false, delay: 100 });

   // If needed, you can use .type text instead to find specific text
  // cy.iframe(`iframe${iframeId}`).find(cssLocator)
  //   .type(value, { force: true, log: false, delay: 100 });

  // Click outside the iframe to remove focus
  cy.get('body').click();

  // Optionally, wait for a short period
  cy.wait(1000);
});

Cypress.Commands.add('dragAndDrop', (source, destination) => {
  const dataTransfer = new DataTransfer();
  cy.get(source).trigger('dragstart', { dataTransfer });
  cy.get(destination).trigger('drop', { dataTransfer });
  
});