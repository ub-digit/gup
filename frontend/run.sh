#!/bin/bash

echo "Starting frontend"
FRONTEND=/home/xmagnn/git/gup/gup/frontend
docker run --name gup_frontend -v $FRONTEND:/apps/application -p 6311:4200 -p 35730:35730 -it docker.ub.gu.se/gup-frontend:dev-2019-05-001
echo "Stopping frontend"
