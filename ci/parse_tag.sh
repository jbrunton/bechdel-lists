#!/bin/bash
set -e

TAG=${GITHUB_REF/refs\/tags\//}
echo "TAG=$TAG"
echo "::set-output name=TAG::$TAG"
