$(document).ready(function(){

	
	 function getRandomColor() {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.round(Math.random() * 15)];
	    }
	    return color;
	}
	var ballColor = getRandomColor();
	
	$('.ballcolor').click(function(){
		ballColor = getRandomColor();
		$('.ballcolor').css({background : ballColor});
	});
	
	$('.ballcolor').css({background : ballColor});
	
	gyro.frequency = 10;
    gyro.startTracking(function(o) {
		socket.emit('sendData', { x: -o.x, y: o.y, z: o.z, color: ballColor})
	});
});
 



	