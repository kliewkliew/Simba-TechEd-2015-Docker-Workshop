FROM mongodb:3.0.5

MAINTAINER Kevin Liew <kevinl@simba.com>

ENV MONGO_USERNAME test
ENV MONGO_PASSWORD test
ENV MONGO_ROLE readWrite

# Start the database
# Wait for the database to initialize
# Add credentials to the server
RUN mongod --fork --logpath /var/log/mongod.log && \
 sleep 10 && \
	mongo --eval "db = db.getSiblingDB('admin'); db.createUser({user:'root', pwd:'root', roles:['root']}); db.auth('root', 'root'); db = db.getSiblingDB('credentials'); db.createUser({user:'$MONGO_USERNAME', pwd:'$MONGO_PASSWORD', roles:['$MONGO_ROLE']});" && \
	mongo --eval "db = db.getSiblingDB('admin'); db.auth('root', 'root'); db.shutdownServer()"

# Expose ports that can be forwarded from the host
EXPOSE 27017 27018 27019

CMD mongod --auth
