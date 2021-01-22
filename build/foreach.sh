#!/bin/bash

set -e

source $(pwd)/build/constants.sh

for pkg in default theme-tasks
do
    cd $dir/packages/$pkg
    npm run $1 --if-present
done
