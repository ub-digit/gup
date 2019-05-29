#!/bin/bash

curl http://localhost:8983/solr/gup-publications/dataimport?command=full-import
curl http://localhost:8983/solr/gup-people/dataimport?command=full-import
curl http://localhost:8983/solr/gup-journals/dataimport?command=full-import
curl http://localhost:8983/solr/gup-guresearch/dataimport?command=full-import
