#!/bin/bash
set -e

cd ${WORKSPACE}/services/client
npm install
npm run test:unit
