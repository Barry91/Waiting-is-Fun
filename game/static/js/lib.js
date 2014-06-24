( function () {

	var lastTime = 0;
	var vendors = [ 'ms', 'moz', 'webkit', 'o' ];

	for ( var x = 0; x < vendors.length && !self.requestAnimationFrame; ++ x ) {

		self.requestAnimationFrame = self[ vendors[ x ] + 'RequestAnimationFrame' ];
		self.cancelAnimationFrame = self[ vendors[ x ] + 'CancelAnimationFrame' ] || self[ vendors[ x ] + 'CancelRequestAnimationFrame' ];

	}

	if ( self.requestAnimationFrame === undefined && self['setTimeout'] !== undefined ) {

		self.requestAnimationFrame = function ( callback ) {

			var currTime = Date.now(), timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
			var id = self.setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );
			lastTime = currTime + timeToCall;
			return id;

		};

	}

	if( self.cancelAnimationFrame === undefined && self['clearTimeout'] !== undefined ) {

		self.cancelAnimationFrame = function ( id ) { self.clearTimeout( id ) };

	}

}() );

function countdown(minutes) {
    var seconds = 60;
    var mins = minutes;
    function tick() {
        var counter = $('#timer');
        var current_minutes = mins-1;
        seconds--;
        counter.html(
		current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds));
        if( seconds > 0 ) {
            setTimeout(tick, 1000);
        } else {
             
            if(mins > 1){
                 
               // countdown(mins-1);   never reach “00″ issue solved:Contributed by Victor Streithorst    
               setTimeout(function () { countdown(mins - 1); }, 1000);
                     
            }
        }
        if(mins == 0 && seconds == 0){
	        console.log('reset timer');
	        mins = 8;
        }
    }
    tick();
}

