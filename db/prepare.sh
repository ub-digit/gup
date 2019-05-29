#!/bin/bash

#pg_dump -v  -Upostgres -dgup -h app-production-1.ub.gu.se --schema='public' --format=c -f "gup-production.dmp"
#drop schema public cascade;
#create schema public;

psql -Upostgres -dpostgres -h localhost -f prepare.sql
pg_restore -v -Upostgres -dgup -h localhost gup-production.dmp