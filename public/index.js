var socket;

socket = io.connect('http://192.168.43.214:3000');
// socket = io.connect('http://localhost:3000');

socket.on('temperature', dostuff)

function dostuff(t){
	var s = document.getElementById("speed");
	s.innerHTML = "Current Temperature: " + t;

	var msg = "Welcome Home!";
	var temp = t.toString() + " C";
	msg = msg.replace(" ", "%20");
	temp = temp.replace(" ", "%20");
	//window.location='https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/sendPush?deviceNames=Asus_X00TD&deviceId=group.android&text='+temp+'&title='+msg+'&apikey=2e4d1566960f44d6950518735d1cd1e0';

}