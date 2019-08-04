//client-side javascript functions. *Mostly* AJAX loading and navigation animations

//records whether the navigation bar is currently open
var open=0;

//records whether we are running on a mobile/small device, 2 is default and means
//haven't decided yet. 0 is desktop/full version, 1 is mobile/compact version
var mobile=2;





//when the window is finished loading, calculate whether we are using
//a mobile screen and resize any "synced" tables that may be running
window.onload= (function(){decideMobile(); resizeTables();});

//whenever a window resize occurs (most often by changing the orientation of
//a mobile device), again calculate whether we are using a mobile screen
//and also resize tables, and the expanded image if it's visible
$(window).resize(function(){decideMobile(); resizeTables(); sizeImage(false);});




//JQuery event listeners
$(document).ready(function(){

    //if a navigation link is clicked, ajax the relevant content into the #loadArea div
    $(".navLink").click(function(){
        $("#loadArea").load("./content/"+$(this).attr("id"),function(){

	    //things to run when load has completed
	    resizeTables();
	});

    });

    //if a showable image is clicked then invoke the function to show it
    $('body').on('click','.thumbnail',function(){
	showImage($(this).attr("src"),$(this).attr("title"));

	//return false to prevent the next listener from also being called
	return false;
    });

    //if the body is clicked when an image is expanded, then unshow it by
    //hiding the overlay (which functions as a parent to the image and caption)
    $('body').on('click',function(){
	if(document.getElementById("expandedOverlay").style.display!="none"){
	    $('#expandedOverlay').fadeOut();
	}
    });
});



//opens/closes the navigation bar in desktop mode
function changeNav() {

    //only perform navigation changes if we are not in mobile mode
    if(mobile==0){
    
	//if the navigation bar is currently closed
	if(open==0){

	    //get the element specified with id widthCalc (the one manually
	    //chosen to be the widest
	    var biggest = document.getElementById("widthCalc");

	    //calculate the width and add 101 px to it
	    var width = (biggest.clientWidth + 101) + "px";
	    
	    //fix the width of the side bar and left margin of the page (to
	    //cause content to be offset by the expansion of the side bar, rather
            //than cause content to reflow which is very unappealing)
	    document.getElementById("navigation").style.width = width;
	    document.getElementById("loadArea").style.marginLeft = width;
	    document.getElementById("bannerArea").style.marginLeft = width;

	    //and the colour of the area specified as the side bar
	    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";

	    //change the outwards pointer char to an inwards pointer
	    document.getElementById("navPointer").innerHTML = "&#9664;";

	    //change the open va
	    open=1;
	    
	}

	//if the bar is currently open then call the function to close it
	else{
	    closeNav();
	}

    }
}

//closes the navigation bar by undoing the changes
//performed in the above method
function closeNav(){

    //only if we are not in mobile mode
    if(mobile==0){
	document.getElementById("navigation").style.width = "50px";
	document.getElementById("loadArea").style.marginLeft = "50px";
	document.getElementById("bannerArea").style.marginLeft="50px";
	document.body.style.backgroundColor = "silver";
	document.getElementById("navPointer").innerHTML = "&#9654;";
	open=0;

    }
}

//shows/hides areas of expandable text
function showText(link,area){

    //get the area which we want to make visible
    var visible = document.getElementById(area).style.display;

    //get the link
    var linkLabel=document.getElementById(link).innerHTML;

    //if the area of text is not visible, make it visible and replace
    //the plus sign with a minus sign on the link
    if(visible=="none"){
	$("#"+area).slideDown();
	var newWidth = document.getElementById(link).clientWidth+"px";
	document.getElementById(link).style.width=newWidth;
	document.getElementById(link).innerHTML=linkLabel.replace("+]","-] ");
    }

    //otherwise make the area of text invisible and replace the minus with
    //a plus sign on the link
    else{
	$("#"+area).slideUp();
	document.getElementById(link).style.width="auto";
	document.getElementById(link).innerHTML=linkLabel.replace("-] ","+]");
    }
}


//sets the width of columns in "synced" tables visible on the page to be the same
function resizeTables(){

    //get all tables part of the synctable class
    var tableArr = document.getElementsByClassName('synctable');
    var cellWidths = new Array();

    //for each column, get the widest cell width across all tables
    for(i = 0; i < tableArr.length; i++){
        for(j = 0; j < tableArr[i].rows[0].cells.length; j++){
           var cell = tableArr[i].rows[0].cells[j];
           if(!cellWidths[j] || cellWidths[j] < cell.clientWidth)
               cellWidths[j] = cell.clientWidth;
        }
    }

    // set all columns to the widest width found above
    for(i = 0; i < tableArr.length; i++){
        for(j = 0; j < tableArr[i].rows[0].cells.length; j++){
            tableArr[i].rows[0].cells[j].style.width = cellWidths[j]+'px';
        }
    }
}

//show the image which has been clicked in the expanded form overlayed
function showImage(src,caption){

    //get the path to the full image from the thumbnail version
    var newsource=src.replace("thumbImages","fullImages").replace(".png",".jpg");

    //set the caption appropriately
    document.getElementById("captionField").innerHTML=caption;

    //hide the dynamic image from view for resizing purposes
    var img=document.getElementById("dynamicImage");
    img.style.visibility="hidden";
    
    //set screen to start fading in
    $('#expandedOverlay').fadeIn();

    //resize the image and then make it visible when completed, but only once
    //the image has been successfully loaded
    img.onload=function(){
	sizeImage(true);
	img.style.visibility="visible";
    };
        
    //change the source of the single expanded image to be the one we clicked on
    //this will begin the above resizing and finally visible
    img.src =newsource;
}

//changes the size of the expanded image on the overlay so that it does not overflow
function sizeImage(force){

    //if the image is visible
    if(document.getElementById("expandedOverlay").style.display!="none" || force){

	//try setting it to 90% width
	
	var pic = document.getElementById("dynamicImage");	
	
	pic.style.width="90%";
	pic.style.height="auto";
	var h = pic.offsetHeight;

	//but if the height is now above 90%, instead shrink it so it does not
	//exceed 90%
	if(h>(0.9*document.getElementById("imageDiv").offsetHeight)){
	    pic.style.width="auto";
	    pic.style.height="90%";
	    
	}
    }
}

//calculate whether we are viewing the site through a smaller screen (i.e. a mobile
//device or phablet)
function decideMobile(){
    
    var windowWidth = $(window).width();

    //consider 768 to be the smallest "normal" display
    var maxDeviceWidth = 768;

    //record what we were viewing the screen through previously
    var prevValue=mobile;

    //if we are viewing the screen through a phone
    if (windowWidth < maxDeviceWidth) {

	//if the navigation bar is open and we were previously viewing
	//the screen through a desktop, then close it now
	if(open==1 && prevValue==0){
	    closeNav();
	}
	mobile=1;

    }
    else {
        mobile=0;
    }
    
    //if we switched from non-mobile to mobile
    //fix the default css values which were overidden via javascript
    if(prevValue==0 && mobile==1){
	document.getElementById("navigation").style.width = "100%";
	document.getElementById("loadArea").style.marginLeft = "";
	document.getElementById("bannerArea").style.marginLeft="0";
    }

    //if we switched from mobile to non-mobile
    //fix the default css values which were overidden via javascript
    else if(prevValue==1 && mobile==0){
	document.getElementById("navigation").style.width = "50px";
	document.getElementById("loadArea").style.marginLeft = "50px";
	document.getElementById("bannerArea").style.marginLeft="50px";
    }
    
    
}
