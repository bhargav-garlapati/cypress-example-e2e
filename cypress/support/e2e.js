// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./global-commands";
import 'cypress-iframe';
import '@percy/cypress';
import 'cypress-axe';


// Alternatively you can use CommonJS syntax:
// require('./commands')

import addContext from 'mochawesome/addContext'

// Assigning a video file (which is created by default by Cypress) to each test result
// ************************************************
Cypress.on("test:after:run", (test, runnable) => {
    
    let videoName = Cypress.spec.name
    videoName = videoName.replace('/.js.*', '.js')
    const videoUrl = 'videos/' + videoName + '.mp4'

    addContext({ test }, videoUrl)
});
// ************************************************

Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });
  
  before(() => {
    cy.intercept("*", (req) => {
      req.headers["Accept-Encoding"] = "gzip, deflate";
    });
  });