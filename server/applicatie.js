var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8080);
io.set('log level', 1); 

function handler (req, res) {
  fs.readFile('client/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

	
io.sockets.on('connection', function (client) {
	
	console.log('client connected');
	client.emit('message', {
        type: 'log',
        message: 'client connected'
    });

	client.on('sendData', function (data) {
		var found = false;
		for(var i in balls){
			if(balls[i].client == client.store.id){
				found = true;
				balls[i].velocity.x = data.x;
				balls[i].color = data.color;
			}
		}
		if(!found){
			var ball = new Ball();
			ball.client = client.store.id;
			balls.push(ball);
		}
		
	});
	
	client.on('disconnect', function() {
	  	console.log('client disconnected');
	  	for(var i in balls){
			if(balls[i].client == client.store.id){
				balls.splice(i,1);
			}
		}
  	});
		
});

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

var canvas, context, meter;
var platforms = [];
var balls = [];
var counter = 0, streak = 0;

var launcher = {
   init: function(){
       //Start de animatie loop
        animate.loop();
   }
}

var animate = {
    loop: function(){
        setTimeout(animate.loop, 1000/60);
        
        //Posities, snelheid en besturing bijwerken
        animate.update();
    
    },
    update: function(){
        //Timer op 0, tijd voor een nieuw platform
		if(animate.platformTimer <= 0){
			//Zet de platformTimer terug op een random waarde
			animate.platformTimer = getRandomArbitrary(80, 160);
			//Maak een nieuwe platform aan
			var platform = new Platform();
			//Voeg het platform toe aan de array platforms
			platforms.push(platform);
		}
       
        //platformTimer aftellen
        animate.platformTimer--;
        
        //Loop en update platforms
        for(var i in platforms){
            platforms[i].update();
        }
        
        //Update bal     
        for(var i in balls){
        	balls[i].update();
        }
        
        counter = counter;
        
        io.sockets.emit('message', { type:'update', message: {platforms: platforms, balls:balls, counter: counter, streak: streak} });
    },
    //plaformTimer is standaard een randomwaarde
    platformTimer : getRandomArbitrary(80, 160)
}

var Ball = function(){
	 this.position = { 
        x: 0,
        y: 0
    }
    
    this.velocity = {
        x : 0,
        y : 4
    }
    
}

Ball.prototype.collision = function(){
	//Loopt door alle platforms heen
   for(var i in platforms){
        //Kijkt of de ball een platform raakt
        var b = this.position, p = platforms[i].position, w = platforms[i].width/2, h = platforms[i].height/2;
        if(b.x > p.x - w && b.x < p.x + w && b.y > p.y - h && b.y < p.y + h) {
            //Maak een sprong
            this.velocity.y = -4;
            if(streak > 5){
	             counter = counter + 2;
	             streak++;
            } else if(streak > 10) {
	            counter = counter + 4;
	            streak++;
            } else if(streak > 15) {
	            counter = counter + 8;
	            streak++;
            } else {
	           counter++;
	           streak++;
            }
           
        }
    }
    
  for(var i in balls){
        if(balls[i] != this){
          var b = this.position, ob = balls[i].position, w = 15, h = 15;
	        if(b.x > ob.x - w && b.x < ob.x + w && b.y > ob.y - h && b.y < ob.y + h) {
	        	this.velocity.y = -5;
	        	counter += 5;
	        }
        }
      
    }

}

Ball.prototype.update = function(){
	this.collision();
    
    //Positie van de bal word verekend met de velocity
    this.position.x -= this.velocity.x;
    this.position.y += this.velocity.y;
    
    //Pas zwaartekracht toe
    if(this.velocity.y < 4){
        this.velocity.y += 0.07;
    } 
    
    //Als bal buiten scherm raakt, verschijnt hij aan andere kant
    if(this.position.x > 400) this.position.x = -400;
    if(this.position.x < -400) this.position.x = 400;
    if(this.position.y > 267){ 
    	this.position.y = -267; 
    	counter = counter - 3;
    	streak = 0;
    	if(counter < 0) counter = 0;
	}
    //Ball blijft hangen aan de bovenkant
    if(this.position.y < -275) this.position.y = -275;
}

var Platform = function(){
   //Standaard horizontale en verticale positie van een platform
   this.position = {
       x : 0,
       y : 0
   }
   //Begin positie en grootte van het platform
   this.position.x = getRandomArbitrary(-300, 300);
   this.position.y = -265;
   this.width = 50;
   this.height = 8;
}
       
   
Platform.prototype.update = function(){
   //Pas zwaartekracht toe op balkjes
   this.position.y +=0.65;
   //Delete platform wanneer hij buiten beeld komt
   if(this.position.y > 540) {
        //Laatste item in array is de onderste, dus deze mag weg
        platforms.shift();
   }
}

launcher.init();