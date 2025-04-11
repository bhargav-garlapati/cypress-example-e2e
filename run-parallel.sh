#!/bin/bash
set -e

# Get arguments
ENV=$1
SPECS=$2
TOTAL_CONTAINERS=$3
BUILD_ID=$4
RECORD_KEY=$5
TAGS=$6

# Create an array to store process IDs
declare -a PIDS

# Run tests in parallel
for i in $(seq 1 $TOTAL_CONTAINERS); do
  echo "Starting container $i of $TOTAL_CONTAINERS"
  ./run-cypress.sh "$ENV" "$SPECS" "$i" "$BUILD_ID" "$RECORD_KEY" "$TAGS" &
  PIDS[$i]=$!
done

# Wait for all processes to complete
FAILED=0
for i in $(seq 1 $TOTAL_CONTAINERS); do
  if wait ${PIDS[$i]}; then
    echo "Container $i completed successfully"
  else
    echo "Container $i failed with exit code $?"
    FAILED=1
  fi
done

exit $FAILED
