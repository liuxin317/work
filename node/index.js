var server = require('./onRequest.js');
var router = require('./router.js');

server.start(router.route);