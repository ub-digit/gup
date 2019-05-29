#!/bin/bash

echo "Building db"
docker build -f Dockerfile.dev -t docker.ub.gu.se/gup-database:dev-2019-05-001 .
echo "Db built"
