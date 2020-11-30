valid_stages=(lab staging production)

if test "$1" = ""
then
  echo "Usage: $0 <stage name>"
  exit
fi

if ! [[ " "${valid_stages[@]}" " == *" "$1" "* ]] ;then
    echo "\"$1\" is not a valid stage name. Valid names are:"
    echo "${valid_stages[@]}"
    exit 1
fi
