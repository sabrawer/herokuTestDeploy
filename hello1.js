/*
The initial hellow world program, used for setting up
heroku for manual configure and to work with github.
*/

const server = require('http').createServer();

server.on('request',(req,res) => {
	res.writeHead(200,{'content-type': 'text/plain'});
	res.end("Hello world\n");
});
server.listen(8000);
console.log('server listening on port 8000');