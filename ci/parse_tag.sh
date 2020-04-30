#!/bin/bash
set -e

TAG=${GITHUB_REF/refs\/tags\//}
echo "TAG=$TAG"
echo "::set-env name=TAG::$TAG"
