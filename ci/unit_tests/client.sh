#!/bin/bash
set -e

cd ${WORKSPACE}/services/client
npm ci --no-optional
npm run test:unit
