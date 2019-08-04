//module which generates the initial html/javascript to send clientside.

module.exports = {
    generate: function (res){

	//generate page header
	var page= "<!DOCTYPE html>\n\
        <html lang=\"en-GB\"> \n\
        <head> \n\
        <title>Node.js based web template</title> \n\
        <meta charset=\"UTF-8\">\n";

	//meta tag to ensure proper touch zooming and width
	page+="<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n";

        //download css stylesheet and fonts from Google
	page+="<link rel=\"stylesheet\" type=\"text/css\" href=\"/styles/style.css\"> \n\
        <link href='//fonts.googleapis.com/css?family=Playfair Display SC' rel='stylesheet'>\n\
        <link href='//fonts.googleapis.com/css?family=Brawler' rel='stylesheet'>\n";

	//try and download jquery from Google (faster than downloading from this site), but download from here if there
	//is a failure
    page+= "<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js\"></script> \n\
    <script>\n\
    if (typeof jQuery == 'undefined') {\n\
        document.write(unescape(\"%3Cscript src='/javascript/jquery-3.1.1.min.js' type='text/javascript'%3E%3C/script%3E\"));\n\
    }\n\
    </script>\n";
    
    //load local javascript file
    page+="<script src=\"/javascript/localJS.js\"></script> \n\
    </head> \n";

	//generate "please enable javascript" message for when javascript it disabled
	page+="<body> \n\
        <noscript>\n\
            <style type=\"text/css\">\n\
                #pageContainer {display:none;}\n\
            </style>\n\
            <div>\n\
                Sorry but you do not have Javascript enabled. This site requires it (as does most of the internet!). Please enable Javascript and then refresh this page.\n\
            </div>\n\
        </noscript>\n";

    //visible contents of page
    page+="<div id=\"pageContainer\">\n";

    //overlay to put over entire page when viewing expanded image
    page+="<div id=\"expandedOverlay\">\n";

	//window in which to show expanded image
    page+="<div id=\"expandedScreen\">\n";

    //expanded image and caption         
    page+="<div id=\"imageDiv\">\n\
                <img id=\"dynamicImage\" src=\"\" alt=\"empty image\">\n\
            </div>\n\
            <div id=\"captionDiv\">\n\
                <strong id=\"captionField\"></strong>\n\
            </div>\n\
            </div>\n\
            </div>\n";
	
    //generate banner of page
    page+="\
            <div id=\"bannerArea\">\n\
            <br class=\"mobileHide\"><br class=\"mobileHide\">\n\
                    <table id=\"nameAndPicTable\"><tr><td id=\"nameField\">\n\
                    <div id=\"nameArea\">\n\
                        <h1 id=\"nameBanner\" class=\"bannerLabels\">Main title or name\
                            <span id=\"subBanner\" class=\"bannerItems\">Some sub-text</span>\
                        </h1> \n\
                        <h4 class=\"bannerLabels\">Some other sub-text</h4>\n\
                    </div>\n\
                    </td><td id=\"bannerPictureField\">\n\
                        <img id=\"bannerPicture\" src=\"fullImages/image.jpg\">\n\
                    </td></tr></table>\n\
                <div id=\"contactArea\">\n\
                        <h4 class =\"bannerLabels\" style=\"display:inline\">Email: </h4><a class=\"contactItemLink\" href=\"mailto:someemailaddress@xyz.net\">someemailaddress@xyz.net</a>\n\
                        <h4 class=\"bannerLabels\" style=\"display:inline\">File download: </h4><a class=\"contactItemLink\" href=\"Downloads/Link to some PDF.pdf\">[Download PDF]</a>\n\
            </div>\n\
    </div>\n";

    //generate navigation bar
    page+="<div id=\"navigation\">\n\
                <h4 id=\"navTitle\">Navigation</h4><br class=\"navBreak\">\n\
                <span id=\"navPointer\" onclick=\"changeNav()\">&#9654;</span>\n";

	res.write(page);

	//load the list of hyperlinks from the contentList file
	var fs = require('fs');
	fs.readFile("./dynamic/contentList", "utf8", function(err, data){
	    if(err){
		createLinks(res,"error Error");
	    }
	    else{
		createLinks(res,data);
	    }
	});
}
};

//dynamically create the list of links found in the navigation bar
function createLinks(res,hyperlinks){
    var lines = hyperlinks.split("\n");
    var noOfLinks=lines.length;
    var linksMarkup="";
    var longest="Navigation";

    //for every link
    for(i=0;i<noOfLinks;i++){
	var currentLine=lines[i];

	//split the target of the link and the name of the link
	var mainLink = currentLine.split(" ");	

	//remove dashes (which denote spaces in the name of the link)
	mainLink[1]=mainLink[1].replace("-"," ");
	if(mainLink[1].length>longest.length){
	    longest=mainLink[1];
	}
	
	//create the link and add a line break if it isn't the last link
	linksMarkup+="\
        <span class=\"navLink\" id=\""+mainLink[0]+"\" onclick=\"closeNav()\">"+mainLink[1]+"</span>";
	   if(i<noOfLinks){
	        linksMarkup+="<br class=\"navBreak\">"; 
	    }
        linksMarkup+="\n";

    }
    res.write(linksMarkup);
    finishPage(res,longest);
}

//finish generating the page
function finishPage(res,longest){
    var page= "\
            </div> \n";

    //create main content area where AJAX will apply things
    page+="\
            <div id=\"loadArea\"> \n";

    res.write(page);

    //try and load the default page, and present a nice friendly error if there is a problem
    //with that
    var fs = require("fs");
    fs.readFile("./content/page1", function(err, data){
	if(err){
	    res.write("Error loading site content. Please contact the site administrator");
	}
	else{
	    res.write(data);
	}
	    
	//this invisible string is used to calculate width of navigation bar
	//in full desktop mode. It is set to display:none
	var page2="\
                </div> \n\
            </div> \n\
	    <div id=\"widthCalc\"> \n";
	page2+=longest;
	page2+="\n\
        </div>\n\
        </body> \n\
        </html>";

        res.end(page2);
    });
    

}
