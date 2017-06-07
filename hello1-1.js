/*
The initial hellow world program, used for setting up
heroku for manual configure and to work with github.
*/
const fs = require('fs');
const server = require('http').createServer();
let str= "not read";
fs.stat('./temp.txt', function(err,stats){
	if(err)
		str = JSON.stringify(err);
	else
		str = JSON.stringify(stats);

	console.log(str);
});


server.on('request',(req,res) => {
	res.writeHead(200,{'content-type': 'text/plain'});
	res.end(str + "\n");
});
server.listen(8000);
console.log('server listening on port 8000');