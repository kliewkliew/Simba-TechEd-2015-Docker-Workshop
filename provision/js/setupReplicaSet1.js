rs.add('shard1node2.mongodbimg.dev.docker:27017');
cfg = rs.conf();
cfg.members[0].host = 'shard1node1.mongodbimg.dev.docker:27017';
rs.reconfig(cfg);