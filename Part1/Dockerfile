FROM # baseImage:tag

MAINTAINER # name <you@simba.com>

ENV MONGODB_VERSION 3.0.7

# Provision the MongoDB tar file (archives are automatically extracted by Docker, so don't run tar on the image)
ADD # use ADD to extract the mongodb tar to /tmp/

# Install MongoDB for 64-bit Linux and create the default path to store database files
RUN # install mongodb

# Provision the test data
COPY # data folder to /provision/data
COPY # scripts folder to /provision/scripts

# Provision configuration files
COPY # etc folder to /etc

# Expose ports that can be forwarded from the host
EXPOSE 27017 27018 27019
