FROM mongodb:3.0.5

MAINTAINER Kevin Liew <kevinl@simba.com>

RUN sh /scripts/createUser.sh test test readWrite credentials

# Expose ports that can be forwarded from the host
EXPOSE 27017 27018 27019

ENTRYPOINT ["mongod", "--auth"]
