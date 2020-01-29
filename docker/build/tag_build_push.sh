#!/bin/bash
git tag $1
git push origin $1
GIT_REVISION=$1 docker-compose build
./push.sh $1
