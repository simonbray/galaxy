#!/bin/sh

cd "$(dirname "$0")"/../..
python ./scripts/cleanup_datasets/cleanup_datasets.py -d 10 -2 -r "$@" >> ./scripts/cleanup_datasets/purge_histories.log
