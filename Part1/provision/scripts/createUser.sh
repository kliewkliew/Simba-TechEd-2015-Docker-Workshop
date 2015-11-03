# @params username, password, role

# Start the database
# Wait for the database to initialize
# Add credentials to the server

mongod --fork --logpath /var/log/mongod.log

sleep 10

mongo --eval	"db = db.getSiblingDB('admin'); \
			>	db.createUser({user:'root', pwd:'root', roles:['root']}); \
			>	db.auth('root', 'root'); \
			>	db = db.getSiblingDB('credentials'); \
			>	db.createUser({user:'$1', pwd:'$2', roles:['$3']});"
			
mongod --shutdown