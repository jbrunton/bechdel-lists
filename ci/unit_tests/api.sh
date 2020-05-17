#!/bin/bash
set -e

cd ${WORKSPACE}/services/api
bundle install
bin/rails spec:unit
