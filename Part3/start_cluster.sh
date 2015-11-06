#!/bin/bash

# Persistent storage of container database files on the host
LOCALPATH="/mongodb"

SLEEPTIME=15

# If you change this, you also need to modify provision/js/addShard.js, provision/js/setupReplicaSet#.js
IMAGE="mongodb"
TAG="3.0.5"

SKYDNS="172.17.42.1"

echo "Clean up"

containers=( skydns skydock shard1node1 shard1node2 shard2node1 shard2node2 configserver1 mongos1 )
for c in ${containers[@]};
do
	docker kill ${c} 	> /dev/null 2>&1
	docker rm ${c} 		> /dev/null 2>&1
done


echo "Setup skydns/skydock"

docker run -d -p 172.17.42.1:53:53/udp --name skydns crosbymichael/skydns -nameserver 8.8.8.8:53 -domain docker
docker run -d -v /var/run/docker.sock:/docker.sock --name skydock crosbymichael/skydock -ttl 30 -environment dev -s /docker.sock -domain docker -name skydns



for (( i = 1; i < 3; i++ )); do

	echo "Create mongod servers"

	docker run -P -d \
			--name shard${i}node1 \
			--dns 172.17.42.1 \
			--net bridge \
			-v /var/log/$IMAGE-$TAG/shard${i}node1:/var/log/mongodb/ \
		${IMAGE}:${TAG} \
		mongod --replSet set${i} \
			--config /etc/mongod.conf \
			--logpath /var/log/mongodb/mongod.log \
			--notablescan \
			--shardsvr # port 27018

	docker run -P -d \
			--name shard${i}node2 \
			--dns 172.17.42.1 \
			--net bridge \
			-v /var/log/$IMAGE-$TAG/shard${i}node1:/var/log/mongodb/ \
		${IMAGE}:${TAG} \
		mongod --replSet set${i} \
			--config /etc/mongod.conf \
			--logpath /var/log/mongodb/mongod.log \
			--notablescan \
			--shardsvr # port 27018

	sleep $SLEEPTIME # Wait for mongodb to start

	echo "Setup replica set $i"

	docker exec -it \
		shard${i}node1 \
		mongo --port 27018 \
			'/provision/scripts/initiate.js'

	sleep $SLEEPTIME # Waiting for set to be initiated

	docker exec -it \
		shard${i}node1 \
		mongo --port 27018 \
			"/provision/scripts/setupReplicaSet${i}.js"
done

echo "Create configserver"

docker run -P -d \
		--name configserver1 \
		--dns 172.17.42.1 \
		--net bridge \
			-v /var/log/$IMAGE-$TAG/configserver1:/var/log/mongodb/ \
	${IMAGE}:${TAG} \
	mongod --config /etc/mongoc.conf \
			--logpath /var/log/mongodb/mongoc.log \
		--notablescan \
		--configsvr # port 27019

echo "Setup and configure mongo query router"

docker run -p 27017:27017 -d \
			--name mongos1 \
			--dns 172.17.42.1 \
			--net bridge \
			-v /var/log/$IMAGE-$TAG/mongos1:/var/log/mongodb/ \
		${IMAGE}:${TAG} \
		mongos --configdb configserver1.${IMAGE}.dev.docker:27019 \
			--config /etc/mongos.conf \
			--logpath /var/log/mongodb/mongos.log

sleep $SLEEPTIME # Wait for mongos to start

docker exec -it \
		mongos1 \
		mongo '/provision/scripts/addShard.js'

sleep $SLEEPTIME # Wait for shards to register with the query router

docker exec -it \
		mongos1 \
		mongoimport '/provision/data/emp.json'

sleep $SLEEPTIME # Wait for data to be imported

docker exec -it \
		mongos1 \
		mongo '/provision/scripts/enableSharding.js'

sleep $SLEEPTIME # Wait sharding to be enabled

echo "#####################################"
echo "MongoDB Cluster is now ready to use"
echo "Connect to cluster by:"
echo "$ mongo --port $(docker port mongos1 27017 | cut -d ":" -f2)"
