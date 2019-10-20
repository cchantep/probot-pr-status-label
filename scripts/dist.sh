#! /bin/sh

set -e

DIR=`dirname $0`

cd "$DIR/.."

npm run build
tar -czvf app.tgz action.yml Dockerfile app.yml lib/ package-lock.json package.json
