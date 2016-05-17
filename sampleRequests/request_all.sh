#!/usr/bin/env bash

for file in $(ls *.js) ; do
    echo ${file}
    curl -s -XPOST localhost:3000/ -d @${file} &
done