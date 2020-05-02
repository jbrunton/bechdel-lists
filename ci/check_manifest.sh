#!/bin/bash
set -e

npm run deploy:check -- --output-file check.env
source check.env

echo "::set-env name=DEPLOYMENT_REQUIRED::$DEPLOYMENT_REQUIRED"
echo "::set-env name=BUILD_IDS::$BUILD_IDS"
