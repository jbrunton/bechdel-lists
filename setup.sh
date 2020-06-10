#!/bin/bash
set -e

PROD_SECRETS_DIR=./k8s/prod/secrets

if [ "$1" == "dev" ]; then
  export SECRETS_DIR=./k8s/dev/secrets
elif [ "$1" == "prod" ]; then 
  if [ -z $SECRETS_DIR ]; then
    echo "SECRETS_DIR not specified."
    exit 1
  fi
  echo "Copying secrets from $SECRETS_DIR to $PROD_SECRETS_DIR"
  cp -R $SECRETS_DIR $PROD_SECRETS_DIR
elif [ "$1" == "clean" ]; then
  echo "Removing files in $PROD_SECRETS_DIR"
  rm -rf $PROD_SECRETS_DIR
  exit 0
else
  echo "Missing or invalid environment."
  echo "Valid usage:"
  echo "  ./setup.sh dev"
  echo "  SECRETS_DIR=/path/to/secrets/dir ./setup-k8s prod"
  echo "  ./setup-k8s clean"
  exit 1
fi
