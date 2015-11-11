FROM centos:6.6

MAINTAINER Kevin Liew <kevinl@simba.com>

ENV MONGODB_VERSION 3.0.7

# Provision the MongoDB tar file (archives are automatically extracted by Docker, so don't run tar on the image)
ADD provision/tmp/mongodb-linux-x86_64-$MONGODB_VERSION.tgz /tmp/

# Install MongoDB for 64-bit Linux and create the default path to store database files
RUN cp -r /tmp/mongodb-linux-x86_64-$MONGODB_VERSION/bin /usr && \
	mkdir -p /data/db && \
	mkdir -p /data/configdb

# Provision the test data
COPY provision/data /provision/data
COPY provision/scripts /provision/scripts

# Provision configuration files
COPY provision/etc /etc

# Expose ports that can be forwarded from the host
EXPOSE 27017 27018 27019
