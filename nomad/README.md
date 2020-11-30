# gup-nomad

## Install levant:
https://github.com/hashicorp/levant#download--install

## Edit gup.yml and set docker user and passord

$EDITOR gup.yml

## Render job-file:
levant render -var-file=gup.yml gup-template.nomad > gup.nomad

## Run nomad client or server/client in dev mode (nomad -dev-connect config=nomad-dev.hcl):
nomad job run gup.nomad
