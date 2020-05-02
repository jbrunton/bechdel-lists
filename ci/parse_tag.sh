#!/bin/bash
set -e

TAG=${GITHUB_REF/refs\/tags\//}
echo "TAG=$TAG"

git fetch --unshallow
git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
git fetch origin

echo "Checking master contains tag $TAG"
# This works because grep finishes with an exit code of 1 if it doesn't find anything
echo "is shallow?"
git rev-parse --is-shallow-repository
echo "master contains v0.0.5?"
git branch -a --contains tags/v0.0.5 | grep master
echo "master contains $TAG?"
git branch -a --contains tags/$TAG | grep master

echo "::set-env name=TAG::$TAG"