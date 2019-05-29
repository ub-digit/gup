#!/bin/bash

echo "Starting backend"
BACKEND=/home/xmagnn/git/gup/gup/backend
docker run --name gup_backend -v $BACKEND:/apps/application -p 6310:3000 -it docker.ub.gu.se/gup-backend:dev-2019-05-001
echo "Stopping backend"
