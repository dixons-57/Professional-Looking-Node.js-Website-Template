//module which controls what to do when requesting a url that does not
//default to the public (static serving) folder

module.exports = {
    generate: function (url,res) {

	//load the file given by the url value
	var fs = require("fs");
	fs.readFile("."+url, function(err, data){

	    //if no such file exists then send an error
	    if(err){
		res.end("Error1 loading site content. Please contact the site administrator");
	    }

	    //else just respond with the contents of the file
	    else{
		res.end(data);
	    }
	});
    }
};
