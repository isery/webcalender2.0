//Webcalender 2.0
//Michael Hettegger
//QPT1 Fachhochschule Salzburg

//config file for the database link
config = require('./config.js');
//import the icalender libary
icalendar = require('./public/javascripts/ical');
event = new icalendar.VEvent('cded25be-3d7a-45e2-b8fe-8d10c1f8e5a9');
//import the webcalender routing directory
var webcalender = require('./routes/webcalender');
//load the fs module (file system)--> to write in files
fs = require('fs');
//load the server with its modules and create it
var express = require('express')
    app = express.createServer(),
    mongoose = require('mongoose'),
    //db = mongoose.connect('mongodb://localhost/mydb'),
    db = mongoose.connect(config.connection),
	Schema = mongoose.Schema;

//set a schema for the mongoose libary and bind it to an objekt
Schema = mongoose.Schema;
 	var User = new Schema({
  		headline: String,
  		datum: Date,
  		text: String
	});
//select the collection
userModel = mongoose.model('User', User);
objekt = new userModel();

//start server
var app = module.exports = express.createServer();

// Configuration the server
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes--> routes to the webcalender file!
app.get('/', webcalender.webcalender);
app.get('/webcalender*',webcalender.webcalender);
app.get('/save',webcalender.save);
app.get('/show',webcalender.show);
app.get('/showEvent',webcalender.showEvent);
app.get('/deleteEvent',webcalender.deleteEvent);
app.get('/editEvent',webcalender.editEvent);

//set the port to 3000
app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

//this has to be here at the end!!!
// get socket.io module and listen to the server
io = require('socket.io').listen(app);
//if user joins website he will receive server ready and the msg hi
//the console.log is handled by the client javascript socket 
io.sockets.on('connection', function(socket){ 
    socket.emit('server ready', {msg: 'hi'});
}); 