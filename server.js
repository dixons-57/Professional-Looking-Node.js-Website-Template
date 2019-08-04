// import library modules
var express = require('express');
var server = express();
// import custom modules

//dynamically generates overall site interface (via jquery/ajax)
var interface;

//dynamically generates main content and sends it to
//client side javascript with AJAX
var content;

//when calling the root of the site, return html given by the generate
//function in the interface module
server.get('/',function(req,res){
	interface.generate(res);
});

//tell the express (web server) module to use the public
//folder as the root of static content
server.use(express.static('./public'));

//for any other site request (i.e. /url), return the html given by
//the generate function in the content module
//content returned here will be dynamically loaded client-side using
//jquery/ajax, there will be no global page refresh of the client
server.get('/content/*',function(req,res){
    content.generate(req.originalUrl,res);
});

//tells the server to listen on port 80
server.listen(80,function(){
    try{
	//instantiate interface and content modules
	interface=require('./dynamic/createInterface');
	content=require('./dynamic/injectContent');
	console.log("listening on http://localhost:%s",80);
	}
	catch(err){
		console.error('server init failed', err);
		process.exit(1);
	}
});
