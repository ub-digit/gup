#!/bin/bash

echo "Logging in to db container"
docker exec -it gup_database bash
echo "Logging out of db container"
