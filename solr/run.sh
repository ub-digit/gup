#!/bin/bash

echo "Starting solr"
docker run --name gup_solr --add-host=gup_database:172.17.0.4 -it docker.ub.gu.se/gup-solr:dev-2019-05-001
echo "Stopping solr"
