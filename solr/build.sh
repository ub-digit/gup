#!/bin/bash

echo "Building solr"
docker build -f Dockerfile.dev -t docker.ub.gu.se/gup-solr:dev-2019-05-001 .
echo "Solr built"
