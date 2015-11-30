#!/bin/bash

echo "Clean up webserver..."

containers=( server )
for c in ${containers[@]};
do
        docker kill ${c}        > /dev/null 2>&1
        docker rm ${c}          > /dev/null 2>&1
done

echo "Launching webapp server..."

SKYDNS="172.17.0.1"

docker run -d -p 8080:8080 --name server -h server.webapp.dev.docker --dns=$SKYDNS -v ~/Simba-TechEd-2015-Docker-Workshop/Part2/webapp:/root/webapp webapp /etc/bootstrap.sh -d
