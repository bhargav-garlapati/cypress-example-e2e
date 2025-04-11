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
TOTAL_CONTAINERS=${TOTAL_CONTAINERS:-2}  # Default to 2 containers

echo "Running Cypress tests with:"
echo "Environment: $ENV"
echo "Container: $CONTAINER_IDX of $TOTAL_CONTAINERS"
echo "Platform: $CI_PLATFORM"
echo "Service: $CI_SERVICE"
echo "Tags: $TAGS"

# Check if RECORD_KEY is provided
if [ -z "$RECORD_KEY" ]; then
  echo "Error: CYPRESS_RECORD_KEY is required for running tests"
  echo "Please provide a valid record key as the 5th argument or set it as an environment variable"
  exit 1
fi

# Set the record key as an environment variable
export CYPRESS_RECORD_KEY=$RECORD_KEY

# Set up spec pattern based on container index for parallelization
if [ "$SPECS" != "all" ]; then
  SPEC_PATTERN="$SPECS"
else
  # Get all spec files
  SPEC_FILES=($(find cypress/e2e -name "*.cy.js" | sort))
  TOTAL_SPECS=${#SPEC_FILES[@]}
  
  echo "Total spec files found: $TOTAL_SPECS"
  
  # Use modulo to distribute specs across containers
  CONTAINER_SPECS=()
  for ((i=0; i<$TOTAL_SPECS; i++)); do
    if [ $((i % TOTAL_CONTAINERS + 1)) -eq "$CONTAINER_IDX" ]; then
      CONTAINER_SPECS+=("${SPEC_FILES[$i]}")
    fi
  done
  
  # Join the specs with commas
  SPEC_PATTERN=$(echo "${CONTAINER_SPECS[@]}" | tr ' ' ',')
  echo "Container $CONTAINER_IDX running ${#CONTAINER_SPECS[@]} specs"
fi

echo "Using spec pattern: $SPEC_PATTERN"

# Set up grep command if tags are provided
GREP_COMMAND=""
if [ -n "$TAGS" ]; then
  GREP_COMMAND="--env grepTags=$TAGS"
fi

# Set additional environment variables to help with CI integration
export CI=true

# Run Cypress with npx to ensure it's found
ENV=$ENV npx cypress run \
  --spec "$SPEC_PATTERN" \
  $GREP_COMMAND \
  --browser chrome \
  --headless \
  --record \
  --ci-build-id "$BUILD_ID" \
  --group "$CI_PLATFORM-parallel-group" \
  --tag "$CI_PLATFORM,$CI_SERVICE,container-$CONTAINER_IDX"

# Create results directory
mkdir -p cypress/results
