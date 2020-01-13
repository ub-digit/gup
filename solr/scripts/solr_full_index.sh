#!/bin/bash

DELIM="# -------------------------------------------------- #"
date="$(date "+%F %T")"
echo "$DELIM"
echo "# ${date}, starting"
echo "$DELIM"
for core in gup-guresearch gup-people gup-publications gup-journals
do
  curl "http://localhost:8983/solr/${core}/dataimport?command=full-import"
done
