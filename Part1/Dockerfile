FROM centos:6.6

MAINTAINER Kevin Liew <kevinl@simba.com>

ENV MONGODB_VERSION 3.0.5

# Provision the MongoDB tar file (archives are automatically extracted by Docker, so don't run tar on the image)
ADD provision/tmp/mongodb-linux-x86_64-$MONGODB_VERSION.tgz /tmp/

# Install MongoDB for 64-bit Linux
RUN cp -r /tmp/mongodb-linux-x86_64-$MONGODB_VERSION/bin /usr && \
    mkdir -p /data/db && \
	mkdir -p /data/configdb

# Provision the test data (still need to use mongoimport on these json files)
COPY provision/data ~
	
# Provision configuration files
COPY provision/etc /etc
COPY provision/js ~/js

# Expose ports that can be forwarded from the host
EXPOSE 27017 27018 27019
