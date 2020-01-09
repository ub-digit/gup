#!/bin/bash

PATH=$PATH:/usr/local/bin
. /usr/local/rvm/scripts/rvm

DIR=/usr/src/app/repo
cd $DIR
RAILS_ENV=$GUP_ENVIRONMENT bundle exec rake "$1"
