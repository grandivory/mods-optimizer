#!/usr/bin/env bash

if [[ "$1" == "" ]]
then
  echo "Please specify a version to deploy."
  exit 1;
else
  REACT_APP_VERSION=$1
fi

if [[ "$2" == "" ]]
then
  echo "Please specify an environment to deploy to (prod or staging)"
  exit 1;
fi

if [[ ! "$2" =~ ^(prod|staging)$ ]]
then
  echo "The environment must be specified as either prod or staging"
  exit 1;
fi

if [[ "$2" == "prod" ]]
then
  read -r -p "Overwriting your production site! Are you sure? [y/N] " response
  response=${response,,}    # tolower
  if [[ ! "$response" =~ ^(yes|y)$ ]]
  then
    exit 0;
  fi
  endpoint="s3://mods-optimizer.swgoh.grandivory.com"
  cloudfront_id="E1JP7YU7NLGZNZ"
else
  endpoint="s3://staging.mods-optimizer.swgoh.grandivory.com"
  cloudfront_id="E3FV4P0N9FDZ3B"
fi

current_version=`git branch | grep \* | cut -d ' ' -f 2`

if [[ "(HEAD" == "${current_version}" ]]
then
  current_version=`git rev-parse --abrev-ref HEAD -- | grep '^[0-9a-f]'`
fi

# Checkout the version you want to build and build it before deploying to AWS
git checkout ${REACT_APP_VERSION}

# If the checkout failed, then stop the build
if [ $? -ne 0 ]
then
  exit 1;
fi

# Stash any un-committed changes
stash_result=$(git stash)
# We only want to try to unstash if we successfully stashed something. Otherwise, we'll be trying to apply
# changes that we don't want on top of our working branch
if [[ ${stash_result} == Saved* ]]
then
unstash=True
fi

export REACT_APP_VERSION=${REACT_APP_VERSION}

npm run build

aws s3 sync --delete --profile grandivory build/ $endpoint

# Invalidate Cloudfront
aws cloudfront create-invalidation --profile grandivory --distribution-id ${cloudfront_id} --paths /

# Return to the previous working state
if [ ${unstash} -eq True ]
then
  git stash pop
fi
git checkout ${current_version}
