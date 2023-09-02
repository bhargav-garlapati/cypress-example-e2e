#!/bin/sh
set -o nounset -o errexit
cd `dirname $0`

#login to your google account
gcloud auth login

# Get secrets from gcp
gcloud config set project cypress-example-e2e-397816
gcloud secrets versions access 1 --secret=cypress-environment-variables > cypress.env.json

# Install packages
npm install