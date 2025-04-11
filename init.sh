#!/bin/sh
set -o nounset -o errexit
cd `dirname $0`

#login to your google account
gcloud auth login

# Get secrets from gcp
gcloud config set project cypress-example-e2e-397816
gcloud secrets versions access latest --secret=cypress-environment-variables > cypress.env.json

# Install packages
npm install

# To update the secret use the following command
#gcloud secrets versions add cypress-environment-variables --data-file=cypress.env.json
