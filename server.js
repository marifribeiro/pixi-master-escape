const connect = require('connect');
const serveStatic = require('serve-static');
const port = process.env.PORT || 8080;

connect().use(serveStatic(__dirname)).listen(port, function(){
    console.log('Server running, access: http://localhost:8080/index.html');
});