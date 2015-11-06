# @params username, password, role, database

# Start the database
# Wait for the database to initialize
# Add credentials to the server

mongod --fork --logpath /var/log/mongod.log

mongo --eval	"db = db.getSiblingDB('admin'); \
			>	db.createUser({user:'root', pwd:'root', roles:['root']}); \
			>	db.auth('root', 'root'); \
			>	db = db.getSiblingDB('$4'); \
			>	db.createUser({user:'$1', pwd:'$2', roles:['$3']});"
			
mongod --shutdown
