#!/bin/bash
set -e

docker run -v ${WORKSPACE}/services/client/:/e2e -w /e2e cypress/included:3.3.1
