/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 */
var RevealSpeakerNotes = (function() {
    
    var conf = null;
    var defaultInterval = 60;

	window.addEventListener( 'load', function() {
        
        // Plug Fastclick module
        
        FastClick.attach(document.body);


        // Connection to socket to 
    
        // Read configuration file for getting server port
        $.getJSON('../conf/conf.json', function(data){              
            conf = data;
            init();
        }).error(function(e){
            console.log("Error during getting config file : "+e);
        });

    }, false );

    function zeroPadInteger( num ) {
        var str = "00" + parseInt( num );
        return str.substring( str.length - 2 );
    }
    
    function init(){
        
        initSocket();
        timeManagement();
    }
    
    function initSocket(){
        var socket = io.connect('http://'+window.location.hostname+':'+conf.port);
        var localUrl = null;
        var indices = null;
        var fragment = 0;
        socket.on('connect',function(){
           socket.emit('message', {type:'ping'}); 
        });

        var notes = $('#content-notes' );
        var curentSlideIndex = $('.curent-slide');
        var totalSlideIndex = $('.nb-slides');

        var next = $( '#next' );
        var prev = $( '#prev' );
        var up = $( '#up' );
        var down = $( '#down' );
        var show = $( '#show' );

        // Buttons interaction

        next.on('click', function(){
            socket.emit('message', {type : 'operation', data : 'next'});
        });
        prev.on('click', function(){
            socket.emit('message', {type : 'operation', data : 'prev'});
        });
        up.on('click', function(){
            socket.emit('message', {type : 'operation', data : 'up'});
        });
        down.on('click', function(){
            socket.emit('message', {type : 'operation', data : 'down'});
        });
        show.on('click', function(){
            socket.emit('message', {type : 'operation', data : 'show', index: indices, fragment : fragment});
            socket.emit('message', {type : 'operation', data : 'next'});
        });

        // Message from presentation

        socket.on("message", function(json){
            if (json.type === "notes"){							
                if( json.data.markdown ) {
                    notes.html(marked( json.data.notes ));
                }
                else {
                    notes.html(json.data.notes);
                }
            }else if (json.type === "config"){							
                if (json.url && !localUrl){
                   localUrl = "http://"+window.location.hostname+":"+conf.port+json.url+"#speakerNotes";
                   var iframe = document.getElementById("next-slide");                                              
                   iframe.src = localUrl;
                   iframe.onload = function(){
                       
                   }                   
                   totalSlideIndex.html(json.nbSlides);
                }else if (json.indices){
                    indices = json.indices;
                    fragment = 0;
                    curentSlideIndex.html(indices.h+indices.v);                    
                }else if (json.fragment){
                    if (json.fragment === '+1'){
                        fragment++;
                    }else{
                        fragment = Math.min(0, fragment++);
                    }
                }
            }
        });
    }
    
    function timeManagement(){
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

            renderProgress((diff / 1000) % 100);
        
        }, 1000 );
    }
    
    function renderProgress(progress){
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
    


	return {};
})();
