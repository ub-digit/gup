#!/bin/bash

echo "Building backend"
docker build -f Dockerfile.dev -t docker.ub.gu.se/gup-backend:dev-2019-05-001 .
echo "Backend built"
