#!/bin/bash

echo "Building frontend"
docker build -f Dockerfile.dev -t docker.ub.gu.se/gup-frontend:dev-2019-05-001 .
echo "Frontend built"
