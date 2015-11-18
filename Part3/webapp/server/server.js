var Hapi = require('hapi');
var Routes = require('./config/routes');
var Config = require('./config/config');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: Config.server.host,
    port: Config.server.port,
    routes: { cors: true }
});

// Register the plugin
server.register(require('hapi-auth-cookie'), function (err) {
    if (err) {
        throw err;
    }

    // Set our strategy
    server.auth.strategy('session', 'cookie', {
        password: 'worldofwalmart', // cookie secret
        cookie: 'session', // Cookie name
        isSecure: false, // required for non-https applications
        ttl: 24 * 60 * 60 * 1000 // Set session to 1 day
    });
});

// Print some information about the incoming request for debugging purposes
server.ext('onRequest', function (request, reply) {
    console.log(request.path, request.query);
    return reply.continue();
});

server.route(Routes);

// Start the server
server.start(function () {
    console.log(server.info);
    console.log("The server has started on port: " + server.info.port);
});
