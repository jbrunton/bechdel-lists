#!/bin/bash
set -e

cd ${WORKSPACE}/services/${SERVICE}
npm install
npm run test:unit
