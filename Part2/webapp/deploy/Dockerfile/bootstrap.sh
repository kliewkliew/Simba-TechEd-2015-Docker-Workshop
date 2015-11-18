#!/bin/bash

cd /root/GearInn/server
rm -rf ./node_modules
npm i

if [[ $1 == "-d" ]]; then
  #node server.js
  while true; do sleep 1000; done
fi

if [[ $1 == "-bash" ]]; then
  /bin/bash
fi
