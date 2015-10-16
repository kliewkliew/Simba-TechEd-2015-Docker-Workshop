db = db.getSiblingDB("admin");
db.runCommand( { enableSharding : "test" } );
db.emp.createIndex({_id: 'hashed'}, {background: false}));
sh.shardCollection( "test.emp", { _id: "hashed" } );