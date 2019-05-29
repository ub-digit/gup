#!/bin/bash

echo "Starting db"
docker run --name gup_database -it docker.ub.gu.se/gup-database:dev-2019-05-001
echo "Stopping db"
