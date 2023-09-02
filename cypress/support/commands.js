/**
 * getOpts - get the options for staging environments
 *
 * NOTE: A `CYPRESS_CREDENTIALS` environment variable must be defined
 * (locally or in docker/server environment)
 *
 * @returns object - an empty object or object with username and password
 */

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