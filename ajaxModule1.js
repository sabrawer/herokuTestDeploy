/*
This module is inserted (as a string) directly into the node.js application.
see ajaxTest2.js, ajaxTest2.html

Use
------------------
let ajaxDo = getAjaxDo();
......
let obj = {....}  (see below)
ajaxDo(obj);
----------------------

This module has three options:
1. getData mode - Get data, as string,  from server. 
2. sendData mode - Send data as string to server
3. sendQuery mode - Send query (as header query string) to server. 

THE SERVER MUST ALWAYS RETURN SOMETHING.

All data/headers are pure JS plain-text strings.

The interface is: ajaxDo(obj), where obj is
{
	mode: string,		// getData,sendData,sendQuery
	baseUrl: string,	// does not include any / and does NOT include 'hhtp://'
	route: string,		// /[a[/b[/c...]]] - always starts with "/"
	query: aString,		// does not include ?
	data: aString,
	callback: aFunction,	
	functionData: someObject
}

query must be in the form a=b&c=d.....

The callback function has the form 

		function(data, someObject), 

where data is a string. The callback is invoked from
inside the asynchronous function (ie, got on call stack from the event queue).
data could be null because of an error or because there is no data.
someObject can contain, for example, a context (ie, some object's "this"). It can
have any data desired. It is passed to and interpreted by the callback function.

ajaxDo does not return anything. It is synchronous by itself.


*/

function getAjaxDo(){

let modes= new Set(['getData','sendData','sendQuery']);


return function (obj){

	//console.log("AJAX FUNCTION");

	if(! obj.callback) {
		console.log("***********  AJAX FUNCTION - NO CALLBACK");
		return;
	}

	if(! obj.mode) {
		console.log("***********  AJAX FUNCTION - MODE IS FALSY: " + obj.mode);
		return obj.callback(null,'ERROR');
	}

	if(! modes.has(obj.mode)) {
		console.log("***********  AJAX FUNCTION - BAD MODE: " + obj.mode);
		return obj.callback(null,'ERROR');
	}

	let xmlhttp = new XMLHttpRequest();

  	xmlhttp.onreadystatechange = function() {
    		if (this.readyState == 4 && this.status == 200) {

			let txt = this.responseText;
			//console.log("$$$$$$$$$$  calling callback");
			if(obj.functionData)
				return obj.callback(txt, obj.functionData);
			else
				return obj.callback(txt,null);
		}else{
			// this section gets called several times before the
			// real thing.
			//console.log("@@@@@@@@@@@@   ERROR IN  XMLHTTP");
			//console.log("READY STATE: " + this.readyState);
			//return obj.callback(null, "ERROR");
		}		
    	} // function

	let mode = obj.mode;
	let url = "http://" + obj.baseUrl;
	if(obj.route) url += obj.route;

	//console.log(`MODE: ${mode}`);
	
	switch (mode) {
		case 'getData' :
			xmlhttp.open("GET", url, true);
 	 		xmlhttp.send();
			break;
		case 'sendData':
			xmlhttp.open("POST", url, true);
 			xmlhttp.setRequestHeader("Content-type", "text/plain");
			let data = obj.data;
  			xmlhttp.send(data);
			break;
		case 'sendQuery':
			let str = "?" + obj.query;
			url += str;
			xmlhttp.open("GET", url, true);
 	 		xmlhttp.send();
			break;
		default:
			console.log("****************  default in ajax function");
			obj.callback(null,null);
	}
} // function

} //getAjaxDo()



			
			
			
	
		
		