// Setup express and socket.io
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

// Return files that are requested (we could filter if needed)
app.get( '/*' , function( req, res ) {
    // this is the current file they have requested
    var file = req.params[0]; 
    console.log('\t :: Express :: file requested: ' + file);    

    // give them what they want
    res.sendFile(__dirname + '/' + file);
}); 

var connectionList = {};

io.on('connection', function(socket){
  console.log('Connection: ID ' + socket.id);

  socket.on('disconnect', function(){
  	console.log('disconnect');
  });

  socket.on('data', addData);
});

function init() {
  slog('Database startup');
  if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
  } else {
    mongoose.connect(MONGODB_URI);
  }
  let db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    slog('Connection to database established');

    slog('Listing meetings in database');
    Paper.find(function(err,papers) {
      for (pi in papers) {
        console.log(papers[pi].titleString());
      }
    });

  });
}

let mtgSchema = new mongoose.Schema({
  id: String, // a unique identifier (date + some info)
  location: String,
  number: Number, // how many people
  perc_faculty: Number, // how many faculty
  perc_pd: Number, // postdocs
  perc_grad: Number, // grad students
  speakerType: Number, // 1/2/3/4
  speakerGender: String, // see below
  timestamps: Array, // timestamp of events
  talkCode: Array, // 1 = faculty, 2 = postdoc, 3 = grad student, 4 = other
  talkGender: Array, // 1 = female, 2 = male, 3 = nonbinary, 4 = 
});

paperSchema.methods.titleString = function() {
  let str = '';
  
  return str;
}

let Meeting = mongoose.model('Meeting',mtgSchema);

function addData(info) {  
  let mtg = new Meeting(info);
  mtg.save();
}

function slog(msg) {
  if (msg.length<=16) {
    console.log('**** SERVER ****');
    console.log(msg);
    console.log('**** ****** ****');
  } else {
    let l = Math.ceil((msg.length-8)/2);
    let stars = '*'.repeat(l);
    console.log(stars+' SERVER '+stars);
    console.log(msg);
    console.log(stars+' ****** '+stars);
  }
}

var port = process.env.PORT || 8080;
http.listen(port, function(){ init(); });