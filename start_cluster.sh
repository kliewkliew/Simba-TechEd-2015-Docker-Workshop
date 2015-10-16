#!/bin/bash

# Persistent storage of container database files on the host
LOCALPATH="/mongodb"

SLEEPTIME=7

# If you change these, you also need to modify provision/js/addShard.js, provision/js/setupReplicaSet#.js
IMAGE="mongodb"
ENVIRONMENT="dev"
DOMAIN="docker"


SKYDNS="172.17.42.1"

echo "Clean up"

containers=( skydns skydock shard1node1 shard1node2 shard2node1 shard2node2 shard3node1 shard3node2 configserver1 configserver2 configserver3 mongos1 )
for c in ${containers[@]}; do
	docker kill ${c} 	> /dev/null 2>&1
	docker rm ${c} 		> /dev/null 2>&1
done


echo "Setup skydns/skydock"

docker run -d -p ${SKYDNS}:53:53/udp --name skydns crosbymichael/skydns -nameserver 8.8.8.8:53 -domain ${DOMAIN}
docker run -d -v /var/run/docker.sock:/docker.sock --name skydock crosbymichael/skydock -ttl 30 -environment ${ENVIRONMENT} -s /docker.sock -domain ${DOMAIN} -name skydns



for (( i = 1; i < 4; i++ )); do
	# Setup local db storage if not exist
	if [ ! -d "${LOCALPATH}/db/${i}-1" ]; then
		mkdir -p ${LOCALPATH}/mongodata/${i}-1
		mkdir -p ${LOCALPATH}/mongodata/${i}-2
		mkdir -p ${LOCALPATH}/mongodata/${i}-cfg
	fi

echo "Create mongod servers"

	docker run -P -d \
			-v ${LOCALPATH}/mongodata/${i}-1:/data/db \
			--dns ${SKYDNS} \
			--name shard${i}node1 \
			-h shard${i}node1.${IMAGE}.${ENVIRONMENT}.${DOMAIN} \
		${IMAGE} \
		mongod --replSet set${i} \
			--dbpath /data/db \
			--config /etc/mongod.conf \
			--notablescan

	docker run -P -d \
			-v ${LOCALPATH}/mongodata/${i}-2:/data/db \
			--dns ${SKYDNS} \
			--name shard${i}node2 \
			-h shard${i}node2.${IMAGE}.${ENVIRONMENT}.${DOMAIN} \
		${IMAGE} \
		mongod --replSet set${i} \
			--dbpath /data/db \
			--config /etc/mongod.conf \
			--notablescan

	sleep $SLEEPTIME # Wait for mongodb to start

echo "Setup replica set"

	docker exec -it \
		shard${i}node1 \
		mongo ~/js/initiate.js

	sleep 10 # Waiting for set to be initiated

	docker exec -it \
		shard${i}node1 \
		mongo ~/js/setupReplicaSet${i}.js

echo "Create configserver"

	docker run -P -d \
			-v ${LOCALPATH}/mongodata/${i}-cfg:/data/db \
			--dns ${SKYDNS} \
			--name configserver${i} \
			-h configserver${i}.${IMAGE}.${ENVIRONMENT}.${DOMAIN} \
		${IMAGE} \
		mongod --dbpath /data/db \
			--config /etc/mongoc.conf \
			--notablescan \
			--configsvr # port 27019
done


echo "Setup and configure mongo router"

docker run -P -d \
			--dns ${SKYDNS} \
			--name mongos1 \
			-h mongos1.${IMAGE}.${ENVIRONMENT}.${DOMAIN} \
		${IMAGE} \
		mongos --configdb configserver1.${IMAGE}.${ENVIRONMENT}.${DOMAIN}:27019,configserver2.${IMAGE}.${ENVIRONMENT}.${DOMAIN}:27019,configserver3.${IMAGE}.${ENVIRONMENT}.${DOMAIN}:27019 \
			--config /etc/mongos.conf \
			--shardsvr # port 27018

sleep $SLEEPTIME # Wait for mongos to start

docker exec -it \
		mongos1 \
		mongo ~/js/addShard.js

sleep $SLEEPTIME # Wait for shards to register with the query router

docker exec -it \
		mongos1 \
		mongo ~/js/addDBs.js

sleep $SLEEPTIME # Wait for db to be created

docker exec -it \
		mongos1 \
		mongo ~/js/enableSharding.js

sleep $SLEEPTIME # Wait sharding to be enabled

echo "#####################################"
echo "MongoDB Cluster is now ready to use"
echo "Connect to cluster by:"
echo "$ mongo --port $(docker port mongos1 27017|cut -d ":" -f2)"