#!/bin/bash
set -e

npm run deploy:check -- --output-file check.env
source check.env

echo "::set-output name=deploymentRequired::$DEPLOYMENT_REQUIRED"
echo "::set-output name=buildIds::$BUILD_IDS"
