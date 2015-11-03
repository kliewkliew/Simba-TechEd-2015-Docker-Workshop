# @params directory of json files to import

# Start the database
# Wait for the database to initialize
# Import data from the specified directory

mongod --fork --logpath /var/log/mongod.log
sleep 10

mongoimport $1

mongod --shutdown