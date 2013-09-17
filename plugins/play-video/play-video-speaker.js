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
    }
};

var PlayVideoSpeaker = PlayVideoSpeaker || {
	conf : null,
    socket : null,
    // We init the client side (websocket + reveal Listener)
	init : function(){
       
          UtilClientNotes.ajaxJSONGet('./plugin/sockets-notes/conf/conf.json', function(data){    
              PlayVideoSpeaker.conf = data;
              PlayVideoSpeaker.initWS();
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
        PlayVideoSpeaker.socket = io.connect('http://'+window.location.hostname+':'+PlayVideoSpeaker.conf.port);
        // On Connection message
        PlayVideoSpeaker.socket.on('connect', function(){            
           
        });
        // On message recieve
        PlayVideoSpeaker.socket.on('message', function (data) {
            if( data.type === "activate-plugin" && data.id === "plugin-play-video"){
            	 
            }
        });
	}
};

PlayVideoSpeaker.init();