//Webcalender 2.0
//Michael Hettegger
//QPT1 Fachhochschule Salzburg
var initialice = function(yr,mt) {
	if(yr==0) {
    	var date=new Date();
    }
    else {
    	var date = new Date(yr,mt,0);
    }
    loadCalender(date);
    createCalender(date);
    
    //opens the socket connection
    var socket = io.connect();
    socket.on('server ready', function(data){ 
    	console.log('Socket Connection achieved');
    	console.log(data);
    });
    //if the Server send through the socket "new Entry"
    //this function will be triggerd
    socket.on('new Entry', function(){ 
    	var date=getDate();
    	loadCalender(date);
    	createCalender(date);
    });
      
    $('#eventPanel').hide();
    $('#newPanel').hide();
    $('#editPanel').hide();
    
    $('#editClose').click(function() {
    	$('#editPanel').hide();
    });
    $('#eventClose').click(function() {
    	$('#eventPanel').hide();
    });
    $('#newClose').click(function() {
    	$('#newPanel').hide();
    });
    
    //New Event Panel
    $('#newBtnSubmit').click(function() {
    	var params = $('#newForm').serialize();
      	jQuery.ajax({
      		type: "GET",
      		url: "/save",
      		data: params,
      		success: function(response){
      			if(response == "succes"){
      				var date=getDate();
      			}
      			else console.log("Konnte nicht erstellt werden");
      		}
      });
      $('#newPanel').hide();
    });
    
    //Edit Event Panel
    $('#edit').click(function() {
    	var params = $('#editForm').serialize();
    	jQuery.ajax({
      		type: "GET",
      		url: "/editEvent",
      		data: params,
      		success: function(response){
      		if(response!=0) {}
      		else console.log("Es konnte nichts verändert werden");
      		}
     	});
    	$('#editPanel').hide();
	});
};