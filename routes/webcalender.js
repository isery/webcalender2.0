//Webcalender 2.0
//Michael Hettegger
//QPT1 Fachhochschule Salzburg

//this function will be called when someone enters the website
//it will check is there is a specific month or year if not 
//it will return 0 and this means that the client javascript 
//uses the current month
exports.webcalender = function(req, res){
	var qu = req.params;
	var urlStr = JSON.stringify(qu);
	var year;
	var month;
	if(urlStr=="[\"\"]" || urlStr=="[\"/\"]") {
		year=0;
		month=0;
	}
	else  {
		urlStr = urlStr.replace(/"/g,"");
		urlStr = urlStr.replace(/\[/g,"");
		urlStr = urlStr.replace(/]/g,"");
		var obj = urlStr.split('/');
		year=obj[2];
		month=obj[4];
		if(isNaN(year) || isNaN(month)) {
			year=0;
			month=0;
		}
	}
	res.render('webcalender', {title: 'Webcalender 2.0', year: year, month: month});
};

//it will find one specific Event, found be its ID
exports.showEvent = function(req, res) {

	var id = req.query["id"];
	userModel.findOne({'_id':id}, function(err, user) {
      if (user != null) {
        res.send("{\"data\":["+JSON.stringify(user)+"]}");
      }
    });
};

//delete a Event
exports.deleteEvent = function(req, res) {

	var id = req.query["id"];
	userModel.findById(id, function(err, user) {
		if (user != null) {
			user.remove();
			getIcs();
			//tell the client that something has changed
			io.sockets.emit('new Entry');
        	res.send("1");
        }
        else {
        	res.send("0");
        }
    });
};

//the function will be called each time something in the 
//Database changes
//it will update the ics file or create it if not already
var getIcs = function() {

	userModel.find({},function(err, user) {
      	if (user != null) {
        	var ical = new icalendar.iCalendar();
			ical.addComponent(event2);		
			for(var i =0;i<user.length;i++) {
				var event2 = ical.addComponent('VEVENT');
				event2.setSummary(user[i].headline);
				event2.setDate(new Date(user[i].datum), new Date(user[i].datum)); // Duration in seconds
			}
			var test = ical.toString();
			
			fs.writeFile("./public/tmp/test.ics", test, function(err) {
    			if(err) {
    				console.log(err);
    			} else {
        			console.log("The file was saved!");
				}
			}); 
		}
    });

}
exports.getIcs = getIcs;

//edit a Event
exports.editEvent = function(req, res) {

	var id = req.query["id"];
	var headline = req.query["headline"];
	var text = req.query["text"];
	var datum= req.query["datum"];
	var query = { _id: id };
	userModel.update(query, { headline: headline }, { multi: true }, function(){});
	userModel.update(query, { text: text }, { multi: true }, function(){});
	userModel.update(query, { datum: datum }, { multi: true }, function(){
			getIcs();
			//tell the client that something has changed
			io.sockets.emit('new Entry');
			res.send("1");
	});
};

//get all Events in the specific month
exports.show = function(req, res) {

	var year = req.query["year"];
	var month = req.query["month"];
	var d=new Date(year, month-1, 1, 00, 00, 00, 02);
	var e=new Date(year, month, 1, 00, 00, 00, 01);
    res.contentType('application/json'); 
 	userModel.find({'datum':{$gt:d,$lte:e}}, function(err, user) {
      if (user != null) {
        res.send("{\"data\":"+JSON.stringify(user)+"}");
      }
    });
};

//save an Event in the Database
exports.save = function(req, res) {

	objekt = new userModel();
 	objekt.headline = req.query["headline"];
 	objekt.datum = req.query["datum"];
 	objekt.text = req.query["text"];
 	//because MongoDB subtracts 2 hours of different timezone
 	objekt.datum.setHours(12);
	objekt.save(function(err) {
  		if (err) 
  			throw err;
  		else {
  			getIcs();
  			//tell the client that something has changed
  			io.sockets.emit('new Entry');
  			res.send("succes");
  		}
  	}); 
};


