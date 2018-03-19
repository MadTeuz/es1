'use strict';
const Hapi = require('hapi');
const Basic = require('hapi-auth-basic');

const server = new Hapi.Server();

server.connection({ 
    port: process.env.PORT || 8080, 
    host: process.env.HOST|| 'localhost' 
});

const users = {
    john: {
        username: 'john',
        password: 'secret',
        name: 'John Doe',
        id: '11211sd'
    },
    paul: {
        username: 'paul',
        password: '1234',
        name: 'Paul Newmam',
        id: '234d'
    }
};

const validate = function(request, username, password, callback){
    const user = users[username];

    if(!user)
        return callback(null, false);
    else if (user.password == password)
        return callback(null, true, {id: user.id, name: user.name});
};

server.register(Basic, function (err) {
    if (err)
        throw err;
});

server.auth.strategy('simple', 'basic', { validateFunc: validate });

server.route({
    method: 'GET',
    path: '/',
    config:{
        auth: 'simple',
        handler: function (request, reply) {
            reply('Hello, ' + request.auth.credentials.name);
        }
    }
});

server.start(function (err) {
    if (err)
        throw err;
    console.log("server started");
});
