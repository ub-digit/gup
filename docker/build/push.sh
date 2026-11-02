#!/bin/bash
source .env

# Overwrite GIT_REVISION with first argument if passed
if [ -n "$1" ]; then
  GIT_REVISION=$1
fi

docker push docker.ub.gu.se/gup-frontend:${GIT_REVISION} && \
docker push docker.ub.gu.se/gup-backend:${GIT_REVISION} && \
docker push docker.ub.gu.se/gup-solr:${GIT_REVISION} && \
docker push docker.ub.gu.se/gup-postgres:${GIT_REVISION}
