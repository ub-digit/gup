#!/bin/bash
valid_periodic=("true" "false")

PERIODIC="false"
# If set
if ! [ -z ${2+x} ]
then
  if ! [[ " "${valid_periodic[@]}" " == *" "$2" "* ]] ;then
    echo "\"$2\" is not a valid value for periodic. Valid values are:"
    echo "${valid_periodic[@]}"
    exit 1
  else
    PERIODIC="$2"
  fi
fi

PERIODIC_PREFIX=""
if [ "$PERIODIC" == "true" ]; then
  PERIODIC_PREFIX="schedule-"
fi
