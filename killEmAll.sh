#!/bin/bash

echo "Killing has begun"
docker rm gup_solr
docker rm gup_db
docker rm gup_frontend
docker rm gup_backend
echo "Killing ended"

