//Webcalender 2.0
//Michael Hettegger
//QPT1 Fachhochschule Salzburg

//This function changes URL depending on the year and the month
var changeURL = function(state) {
 (function(window,undefined){
    var History = window.History;
    if ( !History.enabled ) {
         // This is because we can optionally choose to support HTML4 browsers or not.
        return false;
    }
	 // Bind to StateChange Event
    History.Adapter.bind(window,'statechange',function(){ 
        var State = History.getState(); 
    });
    // Change our States
    var title = "Webcalender 2.0"
    var url="/webcalender/year/"+state.year+"/month/"+state.month;
    History.replaceState(state, title, url); 
 })(window);
}

year = null;
month = null;	

//This function gets all Events form the Database
var loadCalender = function(date)
{
	var month = date.getMonth();
	var year  = date.getFullYear();
	month++;
	console.log("loadcalender: "+month+" "+year);

	changeURL({month:month,year:year});
	jQuery.ajax({
		type: "GET",
		url: "/show",
		data: "year="+year+"&month="+(month),
		success: function(response) {
					//will set the right Event in the right field
					setEvents(response);
				}
	});
}

//creates the table(calender) template
var createCalender = function(date)
{
	var days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
	var months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
	var monthDay = [31,28,31,30,31,30,31,31,30,31,30,31];
	var day   = date.getDay();
	month = date.getMonth();
	year  = date.getFullYear();
	var first = new Date(year, month, 1);
	
	//-- create table -------------------------------------------------
	var tbl = document.createElement("table");
	tbl.setAttribute("cellspacing", "0");
	
	
	//-- create table head -------------------------------------------------
	var tblHead = document.createElement("thead");
	
	
	//-- Year-Menu -------------------------------------------------
	var tblRow = document.createElement("tr");
	var tblCell = document.createElement("th");
	tblCell.setAttribute("colspan", "7");
	
	//-- left Button < -------------------------------------------------
	var a = document.createElement("span");
	a.setAttribute("class","next");
	a.onclick = function(){
		setYear(-1);
	};
	a.innerHTML="<";
	tblCell.appendChild(a);
	
	
	//-- Year as string -------------------------------------------------
	tblCell.appendChild(document.createTextNode(" "+year+" "));
	
	//-- Right Button > -------------------------------------------------
	var a = document.createElement("span");
	a.setAttribute("class","next");
	a.onclick = function(){
		setYear(+1);
	};
	a.innerHTML=">";
	
	tblCell.appendChild(a);
	tblCell.setAttribute("id", "jahr");
	tblRow.appendChild(tblCell);
	tblHead.appendChild(tblRow);

	//-- Month-Menu ------------------------------------------------
	var tblRow = document.createElement("tr");
	var tblCell = document.createElement("th");
	tblCell.setAttribute("colspan", "7");
	
	//-- Left Button < -------------------------------------------------
	var a = document.createElement("span");
	a.setAttribute("class","next");
	a.onclick = function(){
		setMonth(-1)
	};
	a.innerHTML="<";
	tblCell.appendChild(a);
	
	//-- Month as a string -------------------------------------------------
	tblCell.appendChild(document.createTextNode(" "+months[month]+" "));
	
	//-- Right Button > -------------------------------------------------
	var a = document.createElement("span");
	a.setAttribute("class","next");
	a.onclick = function(){
		setMonth(+1)
	};
	a.innerHTML=">";
	tblCell.appendChild(a);
	tblCell.setAttribute("id", "monat");
	tblRow.appendChild(tblCell);
	tblHead.appendChild(tblRow);
	
	//-- Weekdays------------------------- --------------------
	var tblRow = document.createElement("tr");
	tblRow.setAttribute("id", "tage");
	
	for(var i=0; i<days.length; i++) {
		var tblCell = document.createElement("th");
		tblCell.setAttribute("class","wochentage");
		tblCell.appendChild(document.createTextNode(days[i]));
		tblRow.appendChild(tblCell);
	}
	tblHead.appendChild(tblRow);
	
	
	//-- Days --------------------------------------------------
	var tblBody = document.createElement("tbody");
	var tblRow = document.createElement("tr");
	
	//-- First Week -------------------------------------
	// d is the day-id---------------------------------------
	for(var i=d=0; i<7; i++) {
		var tblCell = document.createElement("td");
		
		//-- Style for weekend -------------------------
		if(i>4){
			tblCell.setAttribute("class","wochenende");
		}
		var wochentag=first.getDay();
		if(first.getDay()==0){
			wochentag=7;
		}
		
		if(i<wochentag-1){
			tblCell.appendChild(getInfo(null));
		}else{
			tblCell.appendChild(getInfo(++d));
			tblCell.setAttribute("id", "d_"+d);
		}
		tblRow.appendChild(tblCell);
	}
	tblBody.appendChild(tblRow);
	
	var tblRow = document.createElement("tr");
	
	//-- Append days who are not in this month -------------------------------------------
	for(var i=d+1, r=1; i<=monthDay[month]; i++,r++){
		var tblCell = document.createElement("td");
		tblCell.setAttribute("id", "d_"+i);
		if(r>5){
			tblCell.setAttribute("class","wochenende");
		}
		tblCell.appendChild(getInfo(i));
		tblRow.appendChild(tblCell);
		
		// if sunday, get new line
		// ----r is also a day-id
		if(r == 7){
			r=0;
			tblBody.appendChild(tblRow);
			var tblRow = document.createElement("tr");
		}
	}
	
	//-- last weekline ------------------------------------
	//--if r = 0 the it is a sunday-----
	if(r>1){
		while(r<=7){
			var tblCell = document.createElement("td");
			if(r>5){
				tblCell.setAttribute("class","wochenende");
			}
			tblCell.appendChild(getInfo(null));
			tblRow.appendChild(tblCell);
			r++;
		
		}
		tblBody.appendChild(tblRow);
	}

	//--append Head and Body to Table  ----------------------------------------------
	tbl.appendChild(tblHead);
	tbl.appendChild(tblBody);
	var oldCal = document.getElementById("webcalender");
	//---if one calender is there remove it--------
	if(oldCal.firstChild){
		oldCal.removeChild(oldCal.firstChild);	
	}
	oldCal.appendChild(tbl);
}

var getInfo = function(nr) {
	var div = document.createElement("div");
	if(nr){
		var day = document.createElement("span");
		day.setAttribute("class", "datum");
		day.appendChild(document.createTextNode(nr));
		
		var newButton = document.createElement("span");
		newButton.setAttribute("id", "n_"+nr);
		newButton.setAttribute("class", "newEvent");
		newButton.appendChild(document.createTextNode("+"));
		newButton.onclick = function(){
			newEvent(this.id.substring(2));
		};
		
		div.appendChild(day);
		div.appendChild(newButton);
	}else{
		div.setAttribute("class", "leer");
		div.appendChild(document.createTextNode(" "));
	}
	return div;
}

var setEvents = function(request) {
	//request is a Array of JSON with the events
	var obj = request;
	for(var i=0; i<obj.data.length; i++){
		var id=obj.data[i]._id;
		var date = new Date(obj.data[i].datum);
		var day = date.getDate();
		var a = document.createElement("span");
		a.setAttribute("class", "termin");
		a.setAttribute("id", "e_"+id);
		a.onclick = function(){
			showEvent(this.id.substring(2));
		};
		a.innerHTML=obj.data[i].headline;
	
		var del = document.createElement("span");
		del.setAttribute("id", id);
		del.setAttribute("class", "delete");
		del.innerHTML ="";
		del.onclick = function(){
			deleteEvent(this.id);
		};
		
		var edit = document.createElement("span");
		edit.setAttribute("id", id);
		edit.setAttribute("class", "edit");
		edit.innerHTML ="";
		edit.onclick = function(){
			editEvent(this.id);
		}; 
		
		var span = document.createElement("div");
		span.appendChild(a);
		span.appendChild(del);
		span.appendChild(edit);
		
		var day2 = document.getElementById("d_"+day);
		day2.appendChild(span);
	}
}

var setYear = function(nr) {
	var date = new Date(year+nr, month, 1);
	loadCalender(date);
	createCalender(date);
}

var setMonth = function(nr) {
	var date = new Date(year, month+nr, 1);
	loadCalender(date);
	createCalender(date);
}

var getDate = function() {
	var date = new Date(year, month, 1);
	return date;

}
//to edit an Event
var editEvent = function(id) {
	var del = document.getElementById(id);
	var temp = del.parentNode.parentNode.id;
	nr = temp.substring(2);
	console.log("tag: "+nr);
	jQuery.ajax({
		type: "GET",
			url: "/showEvent",
			data: "id="+id,
			success: function(response){
				var obj = JSON.parse(response);
				var headline = obj.data[0].headline;
				var text = obj.data[0].text;
				var date2=year+"-"+(month+1)+"-"+nr;
				document.getElementById('datum2').value=date2;
				document.getElementById('headline2').value=headline;
				document.getElementById('text2').value=text;
				document.getElementById('objectId').value=id;
				$('#editPanel').show();
			}
	});
}

//to delete the event with the objectID = id
var deleteEvent = function(id) {
	jQuery.ajax({
		type: "GET",
			url: "/deleteEvent",
			data: "id="+id,
			success: function(response){
				if(response!=0) {}
				else console.log("nothing found");
			}

	});
}

//create a new Event an set the date in the date input
var newEvent = function(nr){	
	var date2=year+"-"+(month+1)+"-"+nr;
	document.getElementById('datum').value=date2;
	document.getElementById('headline').value="";
	document.getElementById('text').value="";
	$('#newPanel').show();
}

//if an event is clicked this function gets the text from the database
var showEvent = function(id){
	jQuery.ajax({
		type: "GET",
			url: "/showEvent",
			data: "id="+id,
			success: function(response){
				var obj = JSON.parse(response);
				var value = "<b>"+obj.data[0].headline+"</b><br><br><br>"+obj.data[0].text;
				document.getElementById('eventBody').innerHTML = value;
				$('#eventPanel').show();
			}
	});
}