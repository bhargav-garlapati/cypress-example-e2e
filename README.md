# Cypress Example E2E

This repository demonstrates how to set up and run end-to-end tests using Cypress, integrated with a CI/CD pipeline for automated testing. The project is configured to run tests through GitHub Actions, making it easy to execute and publish results automatically.

## Features

- **End-to-End Testing**: Using Cypress to test web applications.
- **CI/CD Integration**: Run tests on GitHub Actions or Google Cloud Build.
- **Test Filtering**: Filter tests by tags to run specific test categories.
- **Automated Reporting**: Test results published to GitHub Pages.
- **Cross-browser Testing**: Supports testing on different browsers via Cypress.
- **Configuration**: Configurable for different environments and use cases.
- **Visual Testing**: Integrated with Percy and LambdaTest SmartUI for visual regression testing.

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
   npm run cy:production
   ```

   To run tests with specific tags:
   ```bash
   CYPRESS_grepTags="ui,authentication" npm run cy:production
   ```

The tests are automatically triggered on every push request, with the results displayed on GitHub Pages.

## Running Tests in CI/CD

### GitHub Actions

You can manually trigger tests in GitHub Actions:

1. Go to the Actions tab in the repository
2. Select "Cypress Tests on GH Actions" workflow
3. Click "Run workflow"
4. Choose your environment, specs, and tags (optional)
5. Click "Run workflow"

### Google Cloud Build

You can manually trigger tests in Google Cloud Build through GitHub Actions:

1. Go to the Actions tab in the repository
2. Select "Cypress Tests on GCP" workflow
3. Click "Run workflow"
4. Choose your environment, specs, and tags (optional)
5. Click "Run workflow"

This will trigger a Cloud Build job that runs the tests and publishes the results.

## Test Tags

Tests are organized with tags to allow running specific types of tests. Available tags include:

- **ui**: User interface tests
- **authentication**: Login and authentication tests
- **form**: Form interaction tests
- **form-elements**: Tests for specific form elements like checkboxes
- **accessibility**: Accessibility tests using axe-core
- **visual-testing**: Visual regression tests using Percy
- **smartui**: Visual tests using LambdaTest SmartUI
- **alerts**: Tests for JavaScript alerts, confirms, and prompts
- **iframe**: Tests for iframe interactions
- **drag-drop**: Tests for drag and drop functionality
- **file-operations**: Tests for file upload/download
- **dom-manipulation**: Tests for DOM manipulation
- **negative-test**: Tests that are expected to fail
- **security**: Security-related tests

You can run tests with specific tags using:
```bash
CYPRESS_grepTags="ui,authentication" npm run cy:production
```

Or in CI/CD by specifying the tags in the workflow inputs.

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
    - UI Visual Testing using Percy & LambdaTest Smart UI (Applitools Eyes coming soon...)
Each test can be run individually or as part of the complete test suite.

You can view the test execution results here:
https://bhargav-garlapati.github.io/cypress-example-e2e/

Percy.io visual regression results:[![To view Percy.io visual regression testing results.](https://percy.io/static/images/percy-badge.svg)](https://percy.io/b72d4388/web/cypress-example-e2e)

License:
This project is licensed under the MIT License. See the LICENSE file for details.
