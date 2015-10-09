# Instant MongoDB sharded cluster
This repository provides a Dockerfile and a bootstrap script to create MongoDB Cluster. After setup is complete a MongoDB sharded cluster will be running on your local machine.

MongoDB cluster consisted of the following docker containers

 - **shard<1-3>node<1-3>**: Mongod server with three replica sets distributes on six mongo containers.
 - **configservers<1-3>**: Stores metadata for sharded cluster distributed on three mongo containers.
 - **mongos1**:	Mongo routing service installed on one mongo container.
 - **skydock**:	Used for service discovery and inserts internal docker images records into skydns.
 - **skydns**: Used as internal DNS for containers.

There unfortunately some hard-coded timeouts due to timing issues with MongoDB.

## Installation:

## Setup Cluster
	./docker/start_cluster.sh"

You should now be able connect to mongos1 and the new sharded cluster:

## Kill/restart cluster
To re-initiate cluster run `start_cluster.sh` again. 

## Persistent storage
Data is stored at `/mongodb/mongodata/`. To remove all data `rm -rf /mongodb/mongodata/*`

## Built upon
 - [Mongo Docker](https://github.com/jacksoncage/mongo-docker/)
 - [MongoDB Sharded Cluster by Sebastian Voss](https://github.com/sebastianvoss/docker)
 - [MongoDB](http://www.mongodb.org/)
 - [Skydock](https://github.com/crosbymichael/skydock)
 - [Skydns](https://github.com/skynetservices/skydns)
 - [Docker](https://github.com/dotcloud/docker/)
