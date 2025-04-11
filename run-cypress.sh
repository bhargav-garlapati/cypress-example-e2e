#!/bin/bash
set -e  # Exit on any error

# Get environment variables from arguments
ENV=$1
SPECS=$2
CONTAINER_IDX=$3
BUILD_ID=$4
RECORD_KEY=$5
TAGS=$6  # New parameter for tags

# Set platform-specific variables if not provided
CI_PLATFORM=${CI_PLATFORM:-gcp}
CI_SERVICE=${CI_SERVICE:-cloud-build}

echo "Running Cypress tests with:"
echo "Environment: $ENV"
echo "Container: $CONTAINER_IDX of 2"
echo "Platform: $CI_PLATFORM"
echo "Service: $CI_SERVICE"
echo "Tags: $TAGS"

# Set up spec pattern
if [ "$SPECS" != "all" ]; then
  SPEC_PATTERN="$SPECS"
else
  SPEC_PATTERN="cypress/e2e/*cy.js"
fi

echo "Using spec pattern: $SPEC_PATTERN"

# Set up grep command if tags are provided
GREP_COMMAND=""
if [ -n "$TAGS" ]; then
  GREP_COMMAND="--env grepTags=$TAGS"
fi

# If RECORD_KEY is provided as an argument, use it
if [ -n "$RECORD_KEY" ]; then
  export CYPRESS_RECORD_KEY=$RECORD_KEY
fi

# Run Cypress
ENV=$ENV cypress run \
  --spec "$SPEC_PATTERN" \
  $GREP_COMMAND \
  --browser chrome \
  --headless \
  --record \
  --parallel \
  --ci-build-id "$BUILD_ID" \
  --group "$CI_PLATFORM-parallel-group" \
  --tag "$CI_PLATFORM,$CI_SERVICE,container-$CONTAINER_IDX"

# Create results directory
mkdir -p cypress/results
