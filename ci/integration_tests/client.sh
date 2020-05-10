#!/bin/bash
set -e

docker run -v $(PWD)/services/client/:/e2e -w /e2e cypress/included:3.3.1
