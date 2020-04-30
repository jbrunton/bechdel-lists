#!/bin/bash
set -e

TAG=${GITHUB_REF/refs\/tags\//}
echo "TAG=$TAG"

echo "Checking master contains tag $TAG"
# This works because grep finishes with an exit code of 1 if it doesn't find anything
git fetch
echo "is shallow?"
git rev-parse --is-shallow-repository
git branch --contains tags/$TAG | grep master

echo "::set-env name=TAG::$TAG"
