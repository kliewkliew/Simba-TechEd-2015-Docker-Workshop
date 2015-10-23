MONGODBIMAGE="mongodb"
TAG='3.0.5'

USERNAME="test"
PASSWORD="test"
ROLE="readWrite"

# Cleanup previous instances
docker stop tempContainer >/dev/null 2>&1
docker rm tempContainer >/dev/null 2>&1
docker stop "$MONGODBIMAGE:$TAG-auth" >/dev/null 2>&1
docker rm "$MONGODBIMAGE:$TAG-auth" >/dev/null 2>&1
docker rmi "$MONGODBIMAGE:$TAG-auth" >/dev/null 2>&1

# Start mongod and add users. Then commit the image
docker run -d \
	--name tempContainer \
	"$MONGODBIMAGE:$TAG" \
	mongod --config /etc/mongod.conf
sleep 20

docker exec tempContainer \
	mongo --eval "db = db.getSiblingDB('admin'); db.createUser({user:'root', pwd:'root', roles:['root']}); db.auth('root', 'root'); db = db.getSiblingDB('credentials'); db.createUser({user:'$USERNAME', pwd:'$PASSWORD', roles:['$ROLE']});"
docker exec tempContainer \
	mongo --eval "db = db.getSiblingDB('admin'); db.auth('root', 'root'); db.shutdownServer()"

docker commit tempContainer "$MONGODBIMAGE:$TAG-auth"
