# @params directory of json files to import

# Start the database
# Wait for the database to initialize
# Import data from the specified directory

mongod --fork --logpath /var/log/mongod.log

for filename in $1/*.json; do
	mongoimport $filename
done

mongod --shutdown
