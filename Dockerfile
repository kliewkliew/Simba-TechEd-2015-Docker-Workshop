FROM        centos:6.6

MAINTAINER  Kevin Liew <kevinl@simba.com>


ENV MONGO_VERSION 3.0.5

ENV MONGO_HOME /usr/local/mongodb

ENV PATH $MONGO_HOME/mongodb-linux-x86_64-$MONGO_VERSION/bin:$PATH


# Provision the MongoDB tar file (archives are automatically extracted by Docker, so don't run tar on the image)
ADD provision/tmp/mongodb-linux-x86_64-$MONGO_VERSION.tgz /tmp/

# Provision configuration files
ADD provision/etc /etc

# Provision the test data
ADD provision/data /tmp

ADD provision/js ~/js

# Install MongoDB for 64-bit Linux
RUN mkdir -p $MONGO_HOME && \
    cp -R -n /tmp/mongodb-linux-x86_64-$MONGO_VERSION/ $MONGO_HOME && \
    mkdir -p /data/db

# Import the test data
RUN mongoimport /tmp/emp.json

# Expose ports that can be forwarded from the host
EXPOSE 27017 27018 27019
