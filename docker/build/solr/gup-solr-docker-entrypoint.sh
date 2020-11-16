#!/bin/bash
#
# docker-entrypoint for gup-solr

set -e

if [[ "$VERBOSE" == "yes" ]]; then
  set -x
fi

# Create core.properties for each core from core.propertis.envsubst
# with environmental variables replaced with actual values

# Only if $VERBOSE? Also probably should not log passord
# even though not really needs to be guarded
echo "Setting core.properties for $(ls $GUP_SOLR_CONF_PATH/cores | xargs):"
envsubst < "$GUP_SOLR_CONF_PATH/core.properties.envsubst" | tee $(ls -d /opt/solr/server/solr/mycores/* | sed 's/$/\/core.properties/')

exec docker-entrypoint.sh "$@"
