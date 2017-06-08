/*
forms3.js - node application

This simple application (using forms3.html) - user enters a key and value,
can store the pair in a temporary database (disappears when server is 
closed). Can get value of a given key, and can delete the record
with a given key.

This is about as dumb an application as one can think of and still have some
kind of functional web page..

This reads files 
	ajaxModule1.js
	forms3.html
These have to be in the same github branch as the application forms3.js.

If this runs in local host, do 

	127.0.0.1:8000

If it is running on heroku, one does 

	https://first-hello-world-brwr.herokuapp.com


*/

class VerySimpleDatabase{
	constructor(){
		this.storage = {};
	};

	store(key,value){
		this.storage[key] = value;
	};

	get(key){
		return this.storage[key];
	};

	delete(key){
		delete this.storage[key];
	};
}

const http = require('http');
const fs = require('fs');
const urlMod = require('url');

const db = new VerySimpleDatabase();


const server = http.createServer();

server.on('request', function(req, res) {

	console.log("In server.on callback");
	console.log(`URL:  ${req.url} `);
	let pathname = urlMod.parse(req.url,true).pathname;
	console.log(` PATHNAME: ${pathname}`);
	let query = urlMod.parse(req.url,true).query;
	console.log(`QUERY: ${JSON.stringify(query)}`);

	switch (pathname) {
		case '/':
			sendWebPage(res);
			break;
		case '/store':
			storeStuff(query,res);
			break;
		case '/get':
			getStuff(query,res);
			break;
		case '/delete':
			deleteStuff(query, res);
			break;
		default:
			console.log("ERROR - bad URL");
			//process.exit();
	}	
});
let port = process.env.PORT || 8000;
server.listen(port);

console.log("server listening on " + port);


function sendWebPage(res){

 	let pg = fs.readFileSync('./forms3.html', 'utf8'); 
	let arr = pg.split("AJAXMODULE1JS");
	let mod = fs.readFileSync('./ajaxModule1.js', 'utf8');
	let page = arr[0].concat(mod, arr[1]);
	//console.log(page);
	
    	res.writeHead(200, {'Content-Type': 'text/html'});
    	res.write(page);
    	res.end();
  };

function storeStuff(q,res){
	console.log("storeStuff: " + JSON.stringify(q));
	db.store(q.key, q.val);
	res.end("done");

}

function getStuff(q,res){
	console.log("getStuff: " + JSON.stringify(q));
	res.end(db.get(q.key));

}

function deleteStuff(q,res){
	console.log("deleteStuff: " + JSON.stringify(q));
	db.delete(q.key);
	res.end("done");

}