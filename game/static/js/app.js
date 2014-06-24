//Use Namespace to prevent conflicts
var APP = APP || {};

(function() {
   'use strict';

    //Create settings obj
   APP.settings = { 
   	
   	canvas: null, 
   	context: null, 
   	meter: null, 
   	counter: null, 
   	streak: null,
	platforms: [],
	balls: []
   }
    
   APP.launcher = {
       init: function(){
           //Selecteer aan de hand van een Id de canvas waarop getekend word
            APP.settings.canvas = document.getElementById('myCanvas');
           //Maak een nieuwe FPSMeter aan
            //meter = new FPSMeter();
           //Pak en defineer context van canvas
            APP.settings.context = APP.settings.canvas.getContext('2d');
           //Start de animatie loop
            APP.animate.loop();
            //start server events
            APP.server.events();
		countdown(13);
            
       }
   }
   
   APP.server = {
   	events: function(){
	   	socket.on('message', function(message){	
			switch(message.type){
			case 'log': 
				console.log(message.message);
			break;
			case 'update':
				APP.settings.platforms = message.message.platforms;
				APP.settings.balls = message.message.balls;
				APP.settings.counter = message.message.counter;
				APP.settings.streak = message.message.streak;
			break;
			}
		});
   	}
   }
	   	
     APP.animate = {
     	loop: function(){
	        //Creeer een animatieloop van +- 60fps
	        setTimeout(APP.animate.loop, 1000/60);
	        //Update de FPSMeter
	        //meter.tick();
	        
	        APP.animate.render();
	    
	},
        render: function(){
            //Maak na elk frame de canvas weer leeg
            APP.settings.context.clearRect(0,0,805,535);
            $('.counter').html(APP.settings.counter);
            $('.streak').html(APP.settings.streak);
            if(APP.settings.streak >= 5 && APP.settings.streak <= 10){
	    		$('.achievement.a1').addClass('show');
	    		$('.multi.a1').addClass('active');
			} else if(APP.settings.streak >= 10 && streak <= 15) {
				$('.achievement').removeClass('show');
				$('.achievement.a2').addClass('show');
				$('.multi.a2').addClass('active');
			} else if(APP.settings.streak >= 15) {
				$('.achievement').removeClass('show');
				$('.achievement.a3').addClass('show');
				$('.multi.a3').addClass('active');
			} else {
				$('.achievement').removeClass('show');
				$('.multi').removeClass('active');
			}
            //Teken bal
            for(var i in APP.settings.balls){
            	 // bepaal middenpunt van object ten op zichte van het midden van het scherm
	            var centerX = (APP.settings.canvas.width / 2) + APP.settings.balls[i].position.x;
	            var centerY = (APP.settings.canvas.height /2) + APP.settings.balls[i].position.y;
	            var radius = 15;
	            
	            //Begin lijn
	            APP.settings.context.beginPath();
	            //Teken cirkel
	            APP.settings.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	            //Inkleuren
	            APP.settings.context.fillStyle = balls[i].color;
	            APP.settings.context.fill();
	            //Teken Stroke
	            APP.settings.context.lineWidth = 2;
	            APP.settings.context.strokeStyle = '#f2f2f2';
	            APP.settings.context.stroke();
	            
			        
            }
            
            //Loop door platforms en teken ze
            for(var i in APP.settings.platforms){
                 // bepaal middenpunt van platform ten op zichte van het midden van het scherm
			      var centerX = (APP.settings.canvas.width / 2) + APP.settings.platforms[i].position.x;
			      var centerY = (APP.settings.canvas.height / 2) + APP.settings.platforms[i].position.y;
			      
			      //Teken platform
			      //Begin lijn
			      APP.settings.context.beginPath();
			      //Bepaal kleur
			      APP.settings.context.fillStyle = '#ecf0f1';
			      //Teken rechthoek
			      APP.settings.context.fillRect(centerX - 30,centerY -4,60,8);
            }
        }
    }
   
   
   //Start lancher.init wanneer het device ready is
   $(document).ready(function(){
	   APP.launcher.init();
   });
   
})();
