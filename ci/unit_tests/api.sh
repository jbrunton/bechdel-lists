#!/bin/bash
set -e

ruby -v
gem install bundler

cd ${WORKSPACE}/services/api
bundle install
bin/rails spec:unit
