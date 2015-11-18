#!/bin/bash
echo "Clean up"
containers=( skydns skydock )
for c in ${containers[@]};
do
	docker kill ${c} 	> /dev/null 2>&1
	docker rm ${c} 		> /dev/null 2>&1
done

echo "Setup skydns/skydock"

SKYDNS="172.17.0.1"

docker run -d -p $SKYDNS:53:53/udp --name skydns crosbymichael/skydns -nameserver 8.8.8.8:53 -domain docker
docker run -d -v /var/run/docker.sock:/docker.sock --name skydock crosbymichael/skydock -ttl 30 -environment dev -s /docker.sock -domain docker -name skydns
