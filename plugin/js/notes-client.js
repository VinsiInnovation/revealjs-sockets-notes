/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 */
var RevealClientNotes = (function() {


    var conf = null;
	var socket = null;
    // look at the url passed to see if we're manipulating the client slides or the speakers slides
    var showModif = window.location.hash === '#speakerNotes';
    
    // If we're manipulating the speakers slides, then we don't display the controls (we want to control it manualy)
    if (showModif){
        Reveal.initialize({
           controls: true,
           transition : 'default',
           transitionSpeed : 'fast'
        });
    }

    // Do an Ajax Call
    function ajaxJSONGet(url, callback){
        var http_request = new XMLHttpRequest();
        http_request.open("GET", url, true);
        http_request.onreadystatechange = function () {
          var done = 4;
          var ok = 200;
          if (http_request.readyState === done && http_request.status === ok){
            callback(JSON.parse(http_request.responseText));
          }
        };
        http_request.send();
    }

    
    // Initialise with the configuration file
    function initConfig(){
          ajaxJSONGet('./plugin/sockets-notes/conf/conf.json', function(data){    
              conf = data;
              initWS();
          });
    }
    
	
    // Init the WebSocket connection
	function initWS(){
        // Get the number of slides
        var nbSlides = 0;
        var continueLoop = true;
        while(continueLoop){
            nbSlides++;                
            continueLoop = Reveal.getSlide(nbSlides);
        }
        
        // Connect to websocket
        socket = io.connect('http://'+window.location.hostname+':'+conf.port);
        // On Connection message
        socket.on('connect', function(){            
            socket.emit('message', {
               type :"config", 
               url : window.location.pathname, 
               nbSlides : nbSlides-1
            });
            // If we are on the slides of speaker, we specify the controls values
            if (showModif){                
               socket.emit('message', {
                   type :"config", 
                   indices : Reveal.getIndices(),
                   controls : getControls()
               });
            }
        });
        // On message recieve
        socket.on('message', function (data) {
            if( data.type === "operation"){	  		
                if (showModif && data.data === "next"){
                    Reveal.next();
                }else if (showModif && data.data === "prev"){
                    Reveal.prev();
                }else if (showModif && data.data === "up"){
                    Reveal.up();
                }else if (showModif && data.data === "down"){
                    Reveal.down();
                }else if (!showModif && data.data === "show"){
                    Reveal.slide( data.index.h, data.index.v, data.fragment );
                }
            }else if( data.type === "ping"){	  		               
                 // We have to check the controls in order to show the correct directions
              
                socket.emit('message', {
                    type :"config", 
                    url : window.location.pathname, 
                    nbSlides : nbSlides-1
                });
                socket.emit('message', {
                    type :"config", 
                    indices : Reveal.getIndices()
                  
                });
            }
        });
	}
    
    
    // Get the curent controls 
    function getControls(){
        var controls = document.querySelector('.controls');
        controls.style.display = "none";
        var upControl = false,
            downControl = false,
            leftControl = false,
            rightControl = false;                
        if (controls){
            upControl = controls.querySelector("div.navigate-up.enabled") ? true : false;
            downControl = controls.querySelector("div.navigate-down.enabled") ? true : false;
            leftControl = controls.querySelector("div.navigate-left.enabled") ? true : false;
            rightControl = controls.querySelector("div.navigate-right.enabled") ? true : false;
        }
        return {
            up : upControl,
            down : downControl,
            left : leftControl,
            right : rightControl
        }
    }


    // Listen to Reveal Events
	function initRevealListener(){

		Reveal.addEventListener( 'slidechanged', function( event ) {
            // We get the curent slide 
			var slideElement = Reveal.getCurrentSlide(),
				messageData = null;
			
            // We get the notes and init the indexs
			var notes = slideElement.querySelector( 'aside.notes' ),
				indexh = Reveal.getIndices().h,
				indexv = Reveal.getIndices().v,
				nextindexh,
				nextindexv;

            
			if( slideElement.nextElementSibling && slideElement.parentNode.nodeName == 'SECTION' ) {
				nextindexh = indexh;
				nextindexv = indexv + 1;
			} else {
				nextindexh = indexh + 1;
				nextindexv = 0;
			}

            // We prepare the message data to send through websocket
			messageData = {
				notes : notes ? notes.innerHTML : '',
				indexh : indexh,
				indexv : indexv,
				nextindexh : nextindexh,
				nextindexv : nextindexv,
				markdown : notes ? typeof notes.getAttribute( 'data-markdown' ) === 'string' : false
			};

            // If we're on client slides
			if (!showModif && socket &&  messageData.notes !== undefined) {
				socket.emit('message', {type : 'notes', data : messageData});				
			}
            
            // If we're on speaker slides
            if (showModif && socket){ 
                // We have to delay the send of this message beacause we have to wait that the transition has be done
                setTimeout(function(){                    
                    socket.emit("message", {
                        type:'config', 
                        indices : Reveal.getIndices(),
                        controls : getControls()
                    });
                }, 500);
            }			
			
		} );
        
        // We listen to fragments modifications
        Reveal.addEventListener( 'fragmentshown', function( event ) {
            socket.emit("message", {type:'config', fragment : '+1'});
        } );
        Reveal.addEventListener( 'fragmenthidden', function( event ) {
            socket.emit("message", {type:'config', fragment : '-1'});
        } );
	}

    // We init the client side (websocket + reveal Listener)
	function init(){
		initConfig();
		initRevealListener();
	}

	return { init: init };
})();

RevealClientNotes.init();
