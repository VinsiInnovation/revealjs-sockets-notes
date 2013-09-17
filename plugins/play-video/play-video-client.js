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

var PlayVideoClient = PlayVideoClient || {
	conf : null,
    socket : null,
    // We init the client side (websocket + reveal Listener)
	init : function(){
       	if (window.location.hash != '#speakerNotes'){
          UtilClientNotes.ajaxJSONGet('./plugin/sockets-notes/conf/conf.json', function(data){    
              PlayVideoClient.conf = data;
              PlayVideoClient.initWS();
          });
      	}	
        
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
        PlayVideoClient.socket = io.connect('http://'+window.location.hostname+':'+PlayVideoClient.conf.port);
        // On Connection message
        PlayVideoClient.socket.on('connect', function(){            
           
        });
        // On message recieve
        PlayVideoClient.socket.on('message', function (data) {
            if( data.type === "activate-plugin" && data.id === "plugin-play-video"){
            	var video = document.querySelector("section.present:not(.stack) video");
				if (video){
					if (video.paused){
						video.play();				
					}else{
						video.pause();
					}
				}
            }else if (data.type === "operation" && data.data === "show"){
            	var video = document.querySelector("section.present:not(.stack) video");
				if (video){
					video.load();
				}
            }
        });
	}
};

PlayVideoClient.init();