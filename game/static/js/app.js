(function() {
   'use strict';
    //Algemene variabele
   var canvas, context, meter, counter, streak;
   var platforms = [];
   var balls = [];
    
   var launcher = {
       init: function(){
		//Selecteer aan de hand van een Id de canvas waarop getekend word
		canvas = $('#myCanvas');
		//Maak een nieuwe FPSMeter aan
		//meter = new FPSMeter();
		//Pak en defineer context van canvas
		context = canvas.getContext('2d');
		//Start de animatie loop
		animate.loop();
	 	//start server events
		server.events();
		countdown(13);
       }
   }
   
   	var server = {
	   	events: function(){
		   	socket.on('message', function(message){	
				switch(message.type){
					case 'log': 
						console.log(message.message);
						break;
					case 'update':
						platforms = message.message.platforms;
						balls = message.message.balls;
						counter = message.message.counter;
						streak = message.message.streak;
						break;
				}
			});
	   	}
   	}
	   	
     var animate = {
     	loop: function(){
	        //Creeer een animatieloop van +- 60fps
	        setTimeout(animate.loop, 1000/60);
	        //Update de FPSMeter
	        //meter.tick();
	        
	        animate.render();
	    
	    },
        render: function(){
            //Maak na elk frame de canvas weer leeg
            context.clearRect(0,0,805,535);
            $('.counter').html(counter);
            $('.streak').html(streak);
            if(streak >= 5 && streak <= 10){
	    		$('.achievement.a1').addClass('show');
	    		$('.multi.a1').addClass('active');
	    } else if(streak >= 10 && streak <= 15) {
			$('.achievement').removeClass('show');
			$('.achievement.a2').addClass('show');
			$('.multi.a2').addClass('active');
	    } else if(streak >= 15) {
			$('.achievement').removeClass('show');
			$('.achievement.a3').addClass('show');
			$('.multi.a3').addClass('active');
	    } else {
			$('.achievement').removeClass('show');
			$('.multi').removeClass('active');
	    }
            //Teken bal
            for(var i in balls){
            	 // bepaal middenpunt van object ten op zichte van het midden van het scherm
	            var centerX = (canvas.width / 2) + balls[i].position.x;
	            var centerY = (canvas.height /2) + balls[i].position.y;
	            var radius = 15;
	            
	            //Begin lijn
	            context.beginPath();
	            //Teken cirkel
	            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	            //Inkleuren
	            context.fillStyle = balls[i].color;
	            context.fill();
	            //Teken Stroke
	            context.lineWidth = 2;
	            context.strokeStyle = '#f2f2f2';
	            context.stroke();
            }
            
            //Loop door platforms en teken ze
            for(var i in platforms){
                 // bepaal middenpunt van platform ten op zichte van het midden van het scherm
		var centerX = (canvas.width / 2) + platforms[i].position.x;
		var centerY = (canvas.height / 2) + platforms[i].position.y;
			      
		//Teken platform
		//Begin lijn
		 context.beginPath();
		//Bepaal kleur
		 context.fillStyle = '#ecf0f1';
		 //Teken rechthoek
		 context.fillRect(centerX - 30,centerY -4,60,8);
            }
        }
    }
   
   
   //Start lancher.init wanneer het device ready is
   $(document).ready(function(){
	 launcher.init();
   });
   
})();
