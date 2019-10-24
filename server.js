const five = require('johnny-five');
var express = require('express')
var socket = require('socket.io')


var board = new five.Board();


var app = express()
var server = app.listen(3000)
app.use(express.static('public'))

console.log('mah server is on')

var io = socket(server)

var rawWindow = new Array(128).fill(0);
var rawMean = 0;
var rawSum = 0;
var speed = 0;
var t = 0;

var roomState = 0;
var val = 0;
var valPrev = 0;

board.on("ready", function() {
	io.sockets.on('connection', newConnection)

	const motor = new five.Motor(6);
	photoresistor = new five.Sensor({
	    pin: "A1",
	    freq: 250
	  });
  	const thermometer = new five.Thermometer({
	  // controller: "TMP36",
	  pin: "A0",
	  toCelsius: function(raw) { // optional
	  	rawSum = rawSum - rawWindow.shift() + raw;
	  	rawMean = rawSum/128;
	  	rawWindow.push(raw);
	  	var sensivity = 2;
	  	var offset = 0;
	  	// console.log(rawWindow, raw, rawMean, parseInt((rawMean / sensivity) + offset))
	  	// console.log(rawMean, parseInt((rawMean / sensivity) + offset))
	    return (rawMean / sensivity) + offset;
	  }
	});

  	photoresistor.on("change", function() {
	    valPrev = val;
	    val = this.value>1000 ? 0 : 1;
    	// console.log(lightVal);
    	console.log(this.value, roomState);
    	if (valPrev==0 && val==1){
		    if (roomState==0){
		        roomState=1;
		        console.log("SENDING")
		        io.emit('temperature', t)
		      }
		    else{
		      roomState=0;
		    }
		  }
		  ;

	  });

	thermometer.on("change", () => {
	    t = thermometer.C;
		t = (t>35) ? 35 : t;
		speed =  (t<24) ? 0 : (100 + (155/15)*(t-24));
		// console.log(t, speed);
		if (roomState == 1){
			console.log("temperature = ", t)
	  		motor.forward(speed);	
		}
		else{
			motor.forward(0);		
		}
		
	});
});

function newConnection(socket) {
	console.log(socket.id)
}

