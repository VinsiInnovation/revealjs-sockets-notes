var UtilClientNotes = UtilClientNotes || {
    ajaxJSONGet : function(url, callback){
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
    },
    extractPath : function(){
      var scripts = document.getElementsByTagName("script");

        for(idx = 0; idx < scripts.length; idx++)
        {
          var script = scripts.item(idx);

          if(script.src && script.src.match(/notes-client\.js$/))
          { 
            var path = script.src;
            return path.substring(0, path.indexOf('client'));
          }
        }
      return "";
    }
};

/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 */
var RevealClientNotes = RevealClientNotes || {
    
    conf : null,
    socket : null,
    // We init the client side (websocket + reveal Listener)
	init : function(){
         // look at the url passed to see if we're manipulating the client slides or the speakers slides
        if (window.location.hash != '#speakerNotes'){
            RevealClientNotes.initConfig();
            RevealClientNotes.initRevealListener();
        }
	},    
    // Initialise with the configuration file
    initConfig : function(){
          UtilClientNotes.ajaxJSONGet(UtilClientNotes.extractPath()+'/conf/conf.json', function(data){    
              RevealClientNotes.conf = data;
              RevealClientNotes.initWS();
          });
        
    },    	
    // Init the WebSocket connection
	initWS : function(){
        // Get the number of slides
        var nbSlides = 0;
        var continueLoop = true;
        while(continueLoop){
            nbSlides++;                
            continueLoop = Reveal.getSlide(nbSlides);
        }
        
        // Connect to websocket
        RevealClientNotes.socket = io.connect('http://'+window.location.hostname+':'+RevealClientNotes.conf.port);
        // On Connection message
        RevealClientNotes.socket.on('connect', function(){            
            RevealClientNotes.socket.emit('message', {
               type :"config", 
               url : window.location.pathname, 
               nbSlides : nbSlides-1
            });
            // If we are on the slides of speaker, we specify the controls values
           RevealClientNotes.socket.emit('message', {
               type :"config", 
               indices : Reveal.getIndices()
           });
        });
        // On message recieve
        RevealClientNotes.socket.on('message', function (data) {
            if( data.type === "operation" && data.data === "show"){
                Reveal.slide( data.index.h, data.index.v, data.fragment );
            }else if( data.type === "ping"){	  		               
                 // We have to check the controls in order to show the correct directions
              
                RevealClientNotes.socket.emit('message', {
                    type :"config", 
                    url : window.location.pathname, 
                    nbSlides : nbSlides-1
                });
                RevealClientNotes.socket.emit('message', {
                    type :"config", 
                    indices : Reveal.getIndices()
                  
                });
            }
        });
	}, 
    // Listen to Reveal Events
	initRevealListener : function (){

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
			if (RevealClientNotes.socket &&  messageData.notes !== undefined) {
				RevealClientNotes.socket.emit('message', {type : 'notes', data : messageData});				
			}
            
            // If we're on speaker slides
            if (RevealClientNotes.socket){                            
                RevealClientNotes.socket.emit("message", {
                    type:'config', 
                    indices : Reveal.getIndices()
                });                
            }			
			
		} );
        
       
	}
    
};

RevealClientNotes.init();
