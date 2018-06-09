#!/usr/bin/env bash

if [[ "$1" == "" ]]
then
  echo "Please specify an environment to deploy to (prod or staging)"
  exit 1;
fi

if [[ ! "$1" =~ ^(prod|staging)$ ]]
then
  echo "The environment must be specified as either prod or staging"
  exit 1;
fi

if [[ "$1" == "prod" ]]
then
  read -r -p "Overwriting your production site! Are you sure? [y/N] " response
  response=${response,,}    # tolower
  if [[ ! "$response" =~ ^(yes|y)$ ]]
  then
    exit 0;
  fi
  endpoint="s3://mods-optimizer.swgoh.grandivory.com"
else
  endpoint="s3://staging.mods-optimizer.swgoh.grandivory.com"
fi

aws s3 sync --delete --profile grandivory build/ $endpoint
