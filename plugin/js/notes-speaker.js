/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 */
var RevealSpeakerNotes = (function() {

	window.addEventListener( 'load', function() {
        
        // Plug Fastclick module
        
        FastClick.attach(document.body);


        // Connection to socket to 
    
        var socket = io.connect('http://'+window.location.hostname+':8080');
        var localUrl = null;
        var indices = null;
        var fragment = 0;
        if( socket ) {
            
            socket.on('connect',function(){
               socket.emit('message', {type:'ping'}); 
            });
    
            var notes = document.getElementById( 'notes' );
    
            var next = document.getElementById( 'next' );
            var prev = document.getElementById( 'prev' );
            var up = document.getElementById( 'up' );
            var down = document.getElementById( 'down' );
            var show = document.getElementById( 'show' );
    
            // Buttons interaction
    
            next.addEventListener('click', function(){
                socket.emit('message', {type : 'operation', data : 'next'});
            });
            prev.addEventListener('click', function(){
                socket.emit('message', {type : 'operation', data : 'prev'});
            });
            up.addEventListener('click', function(){
                socket.emit('message', {type : 'operation', data : 'up'});
            });
            down.addEventListener('click', function(){
                socket.emit('message', {type : 'operation', data : 'down'});
            });
            show.addEventListener('click', function(){
                socket.emit('message', {type : 'operation', data : 'show', index: indices, fragment : fragment});
                socket.emit('message', {type : 'operation', data : 'next'});
            });
    
            // Message from presentation
    
            socket.on("message", function(json){
                if (json.type === "notes"){							
                    if( json.data.markdown ) {
                        notes.innerHTML = marked( json.data.notes );
                    }
                    else {
                        notes.innerHTML = json.data.notes;
                    }
                }else if (json.type === "config"){							
                    if (json.url && !localUrl){
                       localUrl = "http://"+window.location.hostname+":8080"+json.url+"#speakerNotes";
                       var iframe = document.getElementById("next-slide");                          
                       iframe.src = localUrl;
                       iframe.onload = function(){
                           ;
                       }
                        
                    }else if (json.indices){
                        indices = json.indices;
                        fragment = 0;
                    }else if (json.fragment){
                        if (json.fragment === '+1'){
                            fragment++;
                        }else{
                            fragment = Math.min(0, fragment++);
                        }
                    }
                }
            });
            
           
            // Time Management
            var start = new Date(),
                timeEl = document.querySelector( '#time' ),
                //clockEl = document.getElementById( 'clock' ),
                hoursEl = document.getElementById( 'hours' ),
                minutesEl = document.getElementById( 'minutes' ),
                secondsEl = document.getElementById( 'seconds' );
    
            setInterval( function() {
    
                timeEl.style.opacity = 1;
    
                var diff, hours, minutes, seconds,
                    now = new Date();
    
                diff = now.getTime() - start.getTime();
                hours = parseInt( diff / ( 1000 * 60 * 60 ) );
                minutes = parseInt( ( diff / ( 1000 * 60 ) ) % 60 );
                seconds = parseInt( ( diff / 1000 ) % 60 );
    
                //clockEl.innerHTML = now.toLocaleTimeString();
                hoursEl.innerHTML = zeroPadInteger( hours );
                hoursEl.className = hours > 0 ? "" : "mute";
                minutesEl.innerHTML = ":" + zeroPadInteger( minutes );
                minutesEl.className = minutes > 0 ? "" : "mute";
                secondsEl.innerHTML = ":" + zeroPadInteger( seconds );
                renderProgress(diff % 100);
    
            }, 1000 );
            
            
            function renderProgress(progress)
            {
                progress = Math.floor(progress);
                if(progress<25){
                    var angle = -90 + (progress/100)*360;
                    $(".animate-0-25-b").css("transform","rotate("+angle+"deg)");
                }
                else if(progress>=25 && progress<50){
                    var angle = -90 + ((progress-25)/100)*360;
                    $(".animate-0-25-b").css("transform","rotate(0deg)");
                    $(".animate-25-50-b").css("transform","rotate("+angle+"deg)");
                }
                else if(progress>=50 && progress<75){
                    var angle = -90 + ((progress-50)/100)*360;
                    $(".animate-25-50-b, .animate-0-25-b").css("transform","rotate(0deg)");
                    $(".animate-50-75-b").css("transform","rotate("+angle+"deg)");
                }
                else if(progress>=75 && progress<=100){
                    var angle = -90 + ((progress-75)/100)*360;
                    $(".animate-50-75-b, .animate-25-50-b, .animate-0-25-b")
                                                          .css("transform","rotate(0deg)");
                    $(".animate-75-100-b").css("transform","rotate("+angle+"deg)");
                }
            }
    
        }
        else {
    
            document.body.innerHTML =  '<p class="error">Unable to access <code>window.opener.location</code>.<br>Make sure the presentation is running on a web server.</p>';
    
        }


    }, false );

    function zeroPadInteger( num ) {
        var str = "00" + parseInt( num );
        return str.substring( str.length - 2 );
    }


	return {};
})();
