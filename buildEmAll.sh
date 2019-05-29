#!/bin/bash

cd backend
./build.sh
cd ..

cd frontend
./build.sh
cd ..

cd db
./build.sh
cd ..

cd solr
./build.sh
cd ..

