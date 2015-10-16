rs.add('shard2node2.mongodb.dev.docker:27017')
cfg = rs.conf()
cfg.members[0].host = 'shard2node1.mongodb.dev.docker:27017'
rs.reconfig(cfg)