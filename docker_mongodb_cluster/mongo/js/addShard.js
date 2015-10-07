// You can register secondaries with the query router if you enable reads on that secondary, but the default behaviour is to disallow interaction with secondaries (failover only)
sh.addShard("set1/shard1node1.mongodb.dev.docker:27017");
sh.addShard("set2/shard2node1.mongodb.dev.docker:27017");
sh.addShard("set3/shard3node1.mongodb.dev.docker:27017");