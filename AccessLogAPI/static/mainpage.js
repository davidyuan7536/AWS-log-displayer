function LoadDashBoard(){
  $( "#main-content2" ).load("/templates/dashboard.html #main-content2");
}

function LoadTable(){
  $( "#main-content2" ).load("/table");
}

function LoadGraphs(){
  $( "#main-content2" ).load("/templates/graphs.html #main-content");
}

function LoadCalendar(){
  $( "#main-content2" ).load("/calendar");
}

// PREVENT JQUERY REQUESTS FROM APPENDING TIMESTAMP
$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
  if ( options.dataType == 'script' || originalOptions.dataType == 'script' ) {
      options.cache = true;
  }
});

LoadDashBoard();
