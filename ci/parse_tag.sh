#!/bin/bash
set -e

TAG=${GITHUB_REF/refs\/tags\//}
echo "TAG=$TAG"

# Verify the tag appears on master. Grep returns with an exit code of 1 if it doesn't find anything.
git branch --contains tags/$TAG | grep master

echo "::set-env name=TAG::$TAG"
