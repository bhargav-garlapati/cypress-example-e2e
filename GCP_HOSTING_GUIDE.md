# Guide: Running Cypress Tests in Parallel on Google Cloud Platform

This guide outlines how to set up and run Cypress tests in parallel using Google Cloud Build, triggered from GitHub Actions. This setup provides scalable, efficient test execution with centralized reporting.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Key Components](#key-components)
- [Implementation Details](#implementation-details)
- [Step-by-Step Setup Guide](#step-by-step-setup-guide)
- [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)
- [Optimization and Scaling](#optimization-and-scaling)
- [Advanced Configurations](#advanced-configurations)
- [Maintenance and Updates](#maintenance-and-updates)

## Architecture Overview

```
┌─────────────────┐     ┌───────────────────┐     ┌─────────────────────┐
│  GitHub Actions │────▶│  Google Cloud     │────▶│  Cypress Dashboard  │
│  Workflow       │     │  Build            │     │                     │
└─────────────────┘     └───────────────────┘     └─────────────────────┘
        │                        │                          │
        │                        ▼                          │
        │               ┌───────────────────┐               │
        └───────────────│  GCS Bucket       │───────────────┘
                        │  (Test Results)   │
                        └───────────────────┘
```

## Key Components

1. **GitHub Actions Workflow**
   - Triggers multiple Cloud Build jobs in parallel
   - Collects and combines test results
   - Generates and publishes HTML reports

2. **Google Cloud Build**
   - Runs Cypress tests in Docker containers
   - Handles test execution in isolated environments
   - Uploads results to Google Cloud Storage

3. **Cypress Dashboard**
   - Coordinates test distribution across parallel containers
   - Provides unified reporting and insights
   - Stores test history for smart test distribution

## Implementation Details

### Parallelization Strategy

We implemented a matrix-based parallelization strategy that:
- Supports up to 4 parallel machines
- Uses a common build ID across all containers
- Leverages Cypress's built-in parallelization capabilities
- Distributes tests based on historical execution times

### Cloud Build Configuration

Our Cloud Build setup:
- Uses the official `cypress/included` Docker image
- Clones the repository and installs dependencies
- Retrieves secrets from Secret Manager
- Executes tests with appropriate parameters
- Stores results in a GCS bucket

### GitHub Actions Integration

The GitHub Actions workflow:
- Creates a matrix of container indices
- Triggers Cloud Build jobs asynchronously
- Polls for build status completion
- Collects and combines test results
- Generates HTML reports

## Step-by-Step Setup Guide

### Step 1: Set Up Google Cloud Project

1. **Create a new GCP project**
   ```bash
   gcloud projects create [PROJECT_ID] --name="[PROJECT_NAME]"
   gcloud config set project [PROJECT_ID]
   ```

2. **Enable required APIs**
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable secretmanager.googleapis.com
   gcloud services enable storage.googleapis.com
   ```

3. **Create a GCS bucket for test results**
   ```bash
   gsutil mb -l [LOCATION] gs://[PROJECT_ID]-results
   ```

4. **Create a service account for GitHub Actions**
   ```bash
   gcloud iam service-accounts create github-actions --display-name="GitHub Actions"
   ```

5. **Grant necessary permissions**
   ```bash
   # Cloud Build permissions
   gcloud projects add-iam-policy-binding [PROJECT_ID] \
     --member="serviceAccount:github-actions@[PROJECT_ID].iam.gserviceaccount.com" \
     --role="roles/cloudbuild.builds.editor"
   
   # Secret Manager permissions
   gcloud projects add-iam-policy-binding [PROJECT_ID] \
     --member="serviceAccount:github-actions@[PROJECT_ID].iam.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor"
   
   # Storage permissions
   gcloud projects add-iam-policy-binding [PROJECT_ID] \
     --member="serviceAccount:github-actions@[PROJECT_ID].iam.gserviceaccount.com" \
     --role="roles/storage.objectAdmin"
   ```

6. **Create and download service account key**
   ```bash
   gcloud iam service-accounts keys create gcp-sa-key.json \
     --iam-account=github-actions@[PROJECT_ID].iam.gserviceaccount.com
   ```

7. **Store Cypress environment variables in Secret Manager**
   ```bash
   echo '{}' > cypress.env.json
   # Edit cypress.env.json with your environment variables
   gcloud secrets create cypress-environment-variables --data-file=cypress.env.json
   rm cypress.env.json  # Remove local copy
   ```

### Step 2: Create Cloud Build Configuration

Create a `cloudbuild.yaml` file in your repository:

```yaml
steps:
  # Clone the repository
  - name: 'gcr.io/cloud-builders/git'
    args: ['clone', '${_REPO_URL}', '--branch', '${_BRANCH}', '.']

  # Install dependencies
  - name: 'node:20'
    args: ['npm', 'ci']

  # Get secrets from Secret Manager
  - name: 'gcr.io/cloud-builders/gcloud'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        gcloud secrets versions access latest --secret=cypress-environment-variables > cypress.env.json

  # Run Cypress tests with parallelization
  - name: 'cypress/included:14.3.0'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        # Set environment variable for the environment
        export CYPRESS_ENV=${_ENV}
        
        # Determine spec pattern
        if [ "${_SPECS}" != "all" ]; then
          local_spec_pattern="${_SPECS}"
        else
          local_spec_pattern="cypress/e2e/**/*.cy.js"
        fi
        
        # Determine tags
        if [ -n "${_TAGS}" ]; then
          local_tag_param="--tag gcp,cloud-build,container-${_CONTAINER_IDX},${_TAGS}"
        else
          local_tag_param="--tag gcp,cloud-build,container-${_CONTAINER_IDX}"
        fi
        
        npx cypress run \
          --spec "$local_spec_pattern" \
          --browser chrome \
          --headless \
          --record \
          --parallel \
          --ci-build-id "${_COMMON_BUILD_ID}" \
          --group "cloud-build-parallel" \
          $local_tag_param
    env:
      - 'CYPRESS_RECORD_KEY=${_CYPRESS_RECORD_KEY}'
      - 'CI_PLATFORM=gcp'
      - 'CI_SERVICE=cloud-build'
      - 'CONTAINER_IDX=${_CONTAINER_IDX}'
      - 'TOTAL_CONTAINERS=${_TOTAL_CONTAINERS}'
      - 'PERCY_TOKEN=${_PERCY_TOKEN}'
      - 'PROJECT_TOKEN=${_PROJECT_TOKEN}'
      - 'CYPRESS_excludeSpecPattern=**/smart-ui-tests/**'
      - 'CYPRESS_grepOmitFiltered=true'

  # Create container-specific results directory
  - name: 'debian:stable-slim'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        mkdir -p cypress/results/json
        cp -r cypress/results/* cypress/results/json/ 2>/dev/null || true
        echo "Created cypress/results/json directory for test reports"

  # Upload results to GCS
  - name: 'gcr.io/cloud-builders/gsutil'
    args: ['-m', 'cp', '-r', 'cypress/results/json', 'gs://[PROJECT_ID]-results/${BUILD_ID}/cypress/results/']

substitutions:
  _ENV: 'production'  # Default environment
  _SPECS: 'all'       # Default specs to run
  _CONTAINER_IDX: '1'  # Default container index
  _TOTAL_CONTAINERS: '2'  # Default total containers
  _COMMON_BUILD_ID: ''  # Common build ID for all containers
  _REPO_URL: 'https://github.com/[OWNER]/[REPO].git'  # Default repo URL
  _BRANCH: 'main'  # Default branch
  _CYPRESS_RECORD_KEY: ''  # Default empty value, will be overridden by GitHub Actions
  _TAGS: ''  # Default empty value for tags
  _PERCY_TOKEN: ''  # Default empty value for Percy token
  _PROJECT_TOKEN: ''  # Default empty value for SmartUI token

timeout: 1800s  # 30 minutes
```

### Step 3: Create GitHub Actions Workflow

Create a file at `.github/workflows/gcp-cypress.yml`:

```yaml
name: Cypress Tests on GCP

on:
  # Manual trigger only
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to run tests against'
        required: true
        default: 'production'
        type: choice
        options:
          - production
          - staging
      specs:
        description: 'Test specs to run (comma-separated or "all")'
        required: true
        default: 'all'
        type: string
      tags:
        description: 'Tags to filter tests (comma-separated)'
        required: false
        default: ''
        type: string
      parallel_machines:
        description: 'Number of parallel machines to use'
        required: true
        default: '2'
        type: choice
        options:
          - '1'
          - '2'
          - '3'
          - '4'

jobs:
  trigger-gcp-tests:
    name: Trigger GCP Cloud Build
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        # Define container indices up to 4 only
        container_idx: [1, 2, 3, 4]
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Google Cloud SDK
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
          export_environment_variables: true
          
      - name: Set up gcloud CLI
        uses: google-github-actions/setup-gcloud@v1
        with:
          project_id: [PROJECT_ID]

      # Skip this job if container_idx is greater than parallel_machines
      - name: Check if this container should run
        id: check-container
        run: |
          if [ ${{ matrix.container_idx }} -le ${{ github.event.inputs.parallel_machines }} ]; then
            echo "should_run=true" >> $GITHUB_OUTPUT
          else
            echo "should_run=false" >> $GITHUB_OUTPUT
            echo "Skipping container ${{ matrix.container_idx }} as it exceeds parallel_machines=${{ github.event.inputs.parallel_machines }}"
          fi

      - name: Trigger Cloud Build for Container ${{ matrix.container_idx }}
        id: cloud-build
        if: steps.check-container.outputs.should_run == 'true'
        run: |
          # Use GitHub run ID as the common build ID for all containers
          COMMON_BUILD_ID="${{ github.run_id }}"
          
          BUILD_ID=$(gcloud builds submit --config=cloudbuild.yaml \
            --no-source \
            --substitutions=_ENV=${{ github.event.inputs.environment }},_SPECS=${{ github.event.inputs.specs }},_CONTAINER_IDX=${{ matrix.container_idx }},_TOTAL_CONTAINERS=${{ github.event.inputs.parallel_machines }},_COMMON_BUILD_ID="$COMMON_BUILD_ID",_REPO_URL="${{ github.server_url }}/${{ github.repository }}.git",_BRANCH="${{ github.ref_name }}",_CYPRESS_RECORD_KEY="${{ secrets.CYPRESS_RECORD_KEY }}",_TAGS="${{ github.event.inputs.tags }}",_PERCY_TOKEN="${{ secrets.PERCY_TOKEN }}",_PROJECT_TOKEN="${{ secrets.PROJECT_TOKEN }}" \
            --async --format='value(id)')
          echo "build_id=$BUILD_ID" >> $GITHUB_OUTPUT
          echo "Triggered Cloud Build for Container ${{ matrix.container_idx }} with ID: $BUILD_ID"
          echo "Build logs: https://console.cloud.google.com/cloud-build/builds/$BUILD_ID?project=[PROJECT_ID]"

      - name: Wait for Cloud Build to complete
        if: steps.check-container.outputs.should_run == 'true'
        run: |
          echo "Waiting for build ${{ steps.cloud-build.outputs.build_id }} to complete..."
          echo "Build logs: https://console.cloud.google.com/cloud-build/builds/${{ steps.cloud-build.outputs.build_id }}?project=[PROJECT_ID]"
          while true; do
            STATUS=$(gcloud builds describe ${{ steps.cloud-build.outputs.build_id }} --format='value(status)')
            echo "Current status: $STATUS"
            if [ "$STATUS" = "SUCCESS" ]; then
              echo "Build completed successfully!"
              break
            elif [ "$STATUS" = "FAILURE" ] || [ "$STATUS" = "CANCELLED" ] || [ "$STATUS" = "TIMEOUT" ]; then
              echo "Build failed with status: $STATUS"
              exit 1
            fi
            sleep 30
          done

      - name: Download test results from GCS
        id: download-gcs
        if: steps.check-container.outputs.should_run == 'true'
        continue-on-error: true
        run: |
          mkdir -p cypress/results/json/container-${{ matrix.container_idx }}
          gsutil -m cp -r gs://[PROJECT_ID]-results/${{ steps.cloud-build.outputs.build_id }}/* ./ || echo "No results found in GCS bucket"
          echo "GCS downloaded content for container ${{ matrix.container_idx }}:"
          find cypress/results -type f | sort

      - name: Save results folder
        if: steps.check-container.outputs.should_run == 'true'
        uses: actions/upload-artifact@v4
        with:
          name: cypress-results-${{ matrix.container_idx }}
          path: cypress/results/json

  post-tests-results:
    runs-on: ubuntu-latest
    needs: trigger-gcp-tests
    if: ${{ always() }}
    steps: 
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Download all artifacts
        id: download
        continue-on-error: true
        uses: actions/download-artifact@v4
        with:
          path: downloaded-artifacts

      - name: Debug downloaded artifacts
        run: |
          echo "Downloaded artifacts structure:"
          find downloaded-artifacts -type f | sort

      - name: Prepare results directory
        run: |
          mkdir -p cypress/results/json
          # Copy all JSON files from all container directories to the main json directory
          find downloaded-artifacts -name "*.json" -exec cp {} cypress/results/json/ \; || echo "No JSON files found"
          echo "Contents of cypress/results/json:"
          ls -la cypress/results/json || echo "Directory is empty"
  
      - name: Create public directory
        run: mkdir -p public

      - name: Merge test results into one
        run: npm run report:merge || echo "No test results to merge"

      - name: Generate HTML report
        run: npm run report:generate || echo "No report to generate"

      - name: Create default report if no results
        if: ${{ failure() }}
        run: |
          echo "<html><body><h1>No test results available</h1><p>No test results were generated in this run.</p></body></html>" > public/index.html

      - name: Deploy report page
        if: ${{ always() }}
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          user_name: "github-actions[bot]"
          user_email: "github-actions[bot]@users.noreply.github.com"
```

### Step 4: Configure GitHub Repository

1. **Add GitHub Secrets**
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `GCP_SA_KEY`: Content of the service account key JSON file
     - `CYPRESS_RECORD_KEY`: Your Cypress Dashboard record key
     - `PERCY_TOKEN`: (Optional) Your Percy token if using Percy
     - `PROJECT_TOKEN`: (Optional) Your SmartUI token if using SmartUI

2. **Configure package.json**
   
   Ensure your package.json has the necessary scripts for report generation:

   ```json
   {
     "scripts": {
       "report:merge": "mochawesome-merge cypress/results/json/*.json > cypress/results/mochawesome.json",
       "report:generate": "marge cypress/results/mochawesome.json -f report -o public"
     },
     "devDependencies": {
       "mochawesome": "^7.1.3",
       "mochawesome-merge": "^4.3.0",
       "mochawesome-report-generator": "^6.2.0"
     }
   }
   ```

3. **Configure cypress.config.js**

   Ensure your Cypress configuration includes the reporter setup:

   ```javascript
   const { defineConfig } = require('cypress');

   module.exports = defineConfig({
     projectId: 'your-cypress-project-id',
     e2e: {
       setupNodeEvents(on, config) {
         // implement node event listeners here
       },
       specPattern: 'cypress/e2e/**/*.cy.js',
       reporter: 'mochawesome',
       reporterOptions: {
         reportDir: 'cypress/results/json',
         overwrite: false,
         html: false,
         json: true
       }
     }
   });
   ```

### Step 5: Run Your First Parallel Test

1. Go to your GitHub repository's "Actions" tab
2. Select the "Cypress Tests on GCP" workflow
3. Click "Run workflow"
4. Configure the run:
   - Select the environment (e.g., "production")
   - Enter specs to run (e.g., "all" or "cypress/e2e/login.cy.js,cypress/e2e/dashboard.cy.js")
   - Enter any tags (optional)
   - Select the number of parallel machines (e.g., "2")
5. Click "Run workflow"

The workflow will:
- Trigger multiple Cloud Build jobs in parallel
- Show links to each build's logs in the Google Cloud Console
- Poll for build completion status
- Download and combine test results
- Generate and publish an HTML report

## Monitoring and Troubleshooting

### Monitoring Test Execution

1. **GitHub Actions**: View the workflow run in the Actions tab
2. **Cloud Build Console**: Follow the links provided in the workflow logs
3. **Cypress Dashboard**: View test execution in real-time with videos and screenshots
4. **GCS Bucket**: Examine raw test results and artifacts

### Common Issues and Solutions

1. **Cloud Build Permissions**
   - **Issue**: "Permission denied" errors when accessing Secret Manager or GCS
   - **Solution**: Verify service account permissions and roles

2. **Substitution Variables**
   - **Issue**: "Invalid value for 'build.substitutions'" errors
   - **Solution**: Ensure shell variables don't conflict with Cloud Build substitution variables (use `local_` prefix)

3. **Log Streaming**
   - **Issue**: "This tool can only stream logs if you are Viewer/Owner of the project"
   - **Solution**: Use the polling approach implemented in the workflow

4. **Test Results Collection**
   - **Issue**: Missing test results in the final report
   - **Solution**: Check GCS paths and ensure the download step is working correctly

## Optimization and Scaling

### Performance Tuning

1. **Adjust Parallelization**
   - Start with 2 machines and monitor execution time
   - Increase to 3 or 4 machines if tests are still taking too long
   - Note that more machines isn't always faster due to setup overhead

2. **Optimize Test Suite**
   - Use Cypress Dashboard insights to identify slow tests
   - Implement test sharding strategies for very large test suites
   - Consider separating UI tests from API tests

### Cost Optimization

1. **Cloud Build Pricing**
   - Monitor build minutes usage in GCP Billing
   - Consider using preemptible instances for non-critical test runs

2. **Storage Costs**
   - Implement lifecycle policies on your GCS bucket:
     ```bash
     gsutil lifecycle set lifecycle-config.json gs://[PROJECT_ID]-results
     ```
     Where `lifecycle-config.json` contains:
     ```json
     {
       "rule": [
         {
           "action": {"type": "Delete"},
           "condition": {"age": 30}
         }
       ]
     }
     ```

3. **Cypress Dashboard**
   - Free tier: 500 recordings/month, 3 users, 3 parallel runs
   - Consider upgrading for larger teams or more parallel runs

## Advanced Configurations

### Custom Cypress Docker Image

Create a custom Docker image with pre-installed dependencies to speed up builds:

1. Create a `Dockerfile`:
   ```dockerfile
   FROM cypress/included:14.3.0
   
   # Install additional dependencies
   RUN npm install -g some-package
   
   # Add custom configuration
   COPY cypress.config.js /cypress.config.js
   ```

2. Build and push to Container Registry:
   ```bash
   gcloud builds submit --tag gcr.io/[PROJECT_ID]/cypress-custom
   ```

3. Update `cloudbuild.yaml` to use your custom image:
   ```yaml
   - name: 'gcr.io/[PROJECT_ID]/cypress-custom'
   ```

### Test Filtering and Grouping

1. **Run Specific Test Groups**
   - Use Cypress tags to organize tests
   - Update the GitHub workflow to accept tag parameters
   - Pass tags to Cypress using `--env grepTags=@smoke,@regression`

2. **Environment-Specific Tests**
   - Configure different test sets for different environments
   - Use environment variables to control test behavior

### Notifications and Integrations

1. **Slack Notifications**
   Add to your GitHub workflow:
   ```yaml
   - name: Slack Notification
     uses: rtCamp/action-slack-notify@v2
     if: always()
     env:
       SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
       SLACK_TITLE: "Cypress Test Results"
       SLACK_MESSAGE: "Tests completed with status: ${{ job.status }}"
   ```

2. **Jira Integration**
   - Use Cypress plugins to link test results to Jira tickets
   - Add Jira issue keys to test names or descriptions

## Maintenance and Updates

1. **Keep Dependencies Updated**
   - Regularly update Cypress and Node.js versions
   - Monitor for security vulnerabilities in dependencies

2. **Review and Optimize Workflow**
   - Periodically review test execution times
   - Refactor tests that consistently fail or are flaky
   - Update parallelization strategy based on test suite growth

3. **Documentation**
   - Maintain documentation of your setup
   - Document common issues and solutions
   - Create onboarding guides for new team members

## Important Considerations

### Security and Permissions

- **Service Account Permissions**: Ensure your service account has appropriate permissions for Cloud Build, Secret Manager, and GCS
- **Log Access**: Cloud Build logs require specific permissions; direct console links are provided in the workflow
- **Secrets Management**: Sensitive data (API keys, tokens) are stored in Secret Manager

### Performance Optimization

- **Container Resources**: Default Cloud Build containers have 4 vCPUs and 16GB RAM
- **Test Distribution**: Cypress Dashboard intelligently distributes tests based on execution history
- **Parallelization Limits**: We found 4 parallel containers to be optimal for our test suite size

### Cost Management

- **Cloud Build Minutes**: Monitor usage as parallel builds consume multiple build minutes
- **Storage Costs**: Test artifacts and screenshots are stored in GCS; implement lifecycle policies
- **Cypress Dashboard**: Free tier supports limited parallel runs; paid plans may be needed for larger teams

By following this guide, you'll have a robust, scalable Cypress testing infrastructure on Google Cloud Platform that can grow with your project's needs.
