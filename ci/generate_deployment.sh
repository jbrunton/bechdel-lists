#!/bin/bash
set -e

export COMPOSE_FILE=docker-compose.yml

echo "$DOCKER_ACCESS_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

export DEPLOYMENT_NAME=release-${TAG}-$(date '+%Y%m%d%H%M%S')
export DEPLOYMENT_FILE=deployments/${DEPLOYMENT_NAME}.yml
docker-compose -v
docker-compose pull
# docker-compose config resolves contexts to absolute paths, hence using sed to make them relative again
docker-compose config --resolve-image-digests | sed "s#$(pwd)/##" > $DEPLOYMENT_FILE

echo "Generated deployment file $DEPLOYMENT_FILE:"
cat $DEPLOYMENT_FILE

git add $DEPLOYMENT_FILE
git config --global user.email "jbrunton-ci-minion@outlook.com"
git config --global user.name "jbrunton-ci-minion"
git commit -m "Generated deployment file for $TAG"

git status

echo GITHUB_SHA=$GITHUB_SHA
echo GITHUB_REF=$GITHUB_REF

git push origin HEAD:master

echo "::set-env name=DEPLOYMENT_FILE::$DEPLOYMENT_FILE"
