describe('Welcome to the-internet', () => {
    const data = require('../fixtures/content.json');

    // This code is to handle iframes is correct. 
    // However, herokuapp iframe example reached its billing limit. 
    // So this test case will fail!
    it.skip('Handle Iframes', () => {

        // Visit iframe page
        cy.visitPage('/iframe');

        // Check h3 text
        cy.get('h3')
        .contains(data.iframeHeading);

        // This is a custom command located in the global-commands file under the support directory.
        // It is used to locate the iframe and switch to it. For implementation details, please check the global-commands file.
        cy.iframeLocator('[id="mce_0_ifr"]', '[role="menuitem"]:nth-child(2)', '');

    })
})