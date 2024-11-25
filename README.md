# Cypress Example E2E

This repository demonstrates how to set up and run end-to-end tests using Cypress, integrated with a CI/CD pipeline for automated testing. The project is configured to run tests through GitHub Actions, making it easy to execute and publish results automatically.

## Features

- **End-to-End Testing**: Using Cypress to test web applications.
- **CI/CD Integration**: GitHub Actions workflow to run tests on every push.
- **Automated Reporting**: Test results published to GitHub Pages.
- **Cross-browser Testing**: Supports testing on different browsers via Cypress.
- **Configuration**: Configurable for different environments and use cases.

## Getting Started

To set up this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/bhargav-garlapati/cypress-example-e2e.git

2. Install dependencies:
    ```bash
   ./init.sh
(This shell script will fetch env variables from GCP and install dependencies) 

If you encounter access issues, please create a file named `cypress.env.json` in the root directory of the repository locally, and add the following test secrets:

      {
         "BASIC_AUTH_USERNAME": "admin",
         "BASIC_AUTH_PASSWORD": "admin",
         "USERNAME": "tomsmith",
         "PASSWORD": "SuperSecretPassword!",
         "test": "test"
      }

Next, install dependencies `npm install`
      
3. Run Tests 
    ```bash
   npm run cypress:production

The tests are automatically triggered on every push request, with the results displayed on GitHub Pages.

 ## Test Demos
    - A/B Variation
    - Accessibility
    - Add and Remove Elements
    - Basic Auth Test
    - Interacting with Checkboxes
    - Drag and Drop Items
    - Handling Iframes
    - Handling JS Alerts, Confirm, and Prompt
    - Login Flow test
    - Upload file
    - UI Visual Testing using Percy & LambdaTest Smart UI (Applitools Eyes are coming soon...)
Each test can be run individually or as part of the complete test suite.

You can view the test execution results here:
https://bhargav-garlapati.github.io/cypress-example-e2e/

Percy.io visual regression results:[![To view Percy.io visual regression testing results.](https://percy.io/static/images/percy-badge.svg)](https://percy.io/b72d4388/web/cypress-example-e2e)

License:
This project is licensed under the MIT License. See the LICENSE file for details.