var UtilClientNotes = (function () {
    var ajaxJSONGet = function(url, callback){
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
    };

    var extractPath = function(){
      var scripts = document.getElementsByTagName("script");

        for(idx = 0; idx < scripts.length; idx++)
        {
          var script = scripts.item(idx);

          if(script.src && script.src.match(/notes-client\.js$/))
          { 
            var path = script.src;
            return path.substring(0, path.indexOf('reveal_plugin'));
          }
        }
      return "";
    };

    return {
      ajaxJSONGet : ajaxJSONGet,
      extractPath : extractPath
    }
})();

/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 */
var RevealClientNotes = (function () {

  /*
  * **************************************
  * ---------------MODEL------------------
  * **************************************
  */

  var conf = null,
    socket = null,
    pluginList = {};

  /*
  * **************************************
  * ---------INNER METHODS----------------
  * **************************************
  */
  
  // We init the client side (websocket + reveal Listener)
	var init = function(){

    // We check if this script ins't in the iframe of the remote control
    if(!window.parent || !window.parent.document.body.getAttribute('sws-remote-iframe-desactiv')){
        console.log('Initialize Client side')
        initConfig();
        initRevealListener();
    }        
	};    
  
  // Initialise with the configuration file
  var initConfig = function(){
        UtilClientNotes.ajaxJSONGet(UtilClientNotes.extractPath()+'/reveal_plugin/conf/conf.json', function(data){    
            conf = data;
            initWS();
        });
      
  };    	
  
  // Init the WebSocket connection
	var initWS = function(){
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
           socket.emit('message', {
               type :"config", 
               indices : Reveal.getIndices()
           });
        });
        // On message recieve
        socket.on('message', function (data) {
            if( data.type === "operation" && data.data === "show"){
                Reveal.slide( data.index.h, data.index.v, data.fragment );
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
            }else if( data.type === "ping-plugin"){                      
                // We have to check the controls in order to show the correct directions
              
                var pluginIds = Object.keys(pluginList);
                for (var i =0; i < pluginIds.length; i++){
                  socket.emit('message', {
                    type :"plugin", 
                    action :"activate", 
                    id : pluginIds[i]
                  });
                }
                // Delegate to plugins 
                
            }else if( data.type === "communicate-plugin"){                      
                // We have to check the controls in order to show the correct directions              
                if (data.id && pluginList[data.id] ){
                  pluginList[data.id](data.data);
                }
                
                
            }
        });
	}; 

  var reavealCallBack = function(event){
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
    if (socket &&  messageData.notes !== undefined) {
      socket.emit('message', {type : 'notes', data : messageData});       
    }
    // If we're on speaker slides
    if (socket){                            
        socket.emit("message", {
            type:'config', 
            indices : Reveal.getIndices()
        });                
    }   
  }

  // Listen to Reveal Events
	var initRevealListener = function (){
		Reveal.addEventListener( 'slidechanged', reavealCallBack);
	};

  /*
  * **************************************
  * --------EXPOSED METHODS----------------
  * **************************************
  */

  

  var registerPlugin = function (id, callbackAction){
    pluginList[id] = callbackAction;
  }

  /*
  * **************************************
  * --------INITIALIZATION----------------
  * **************************************
  */

  init();

  return {
    registerPlugin : registerPlugin
  };
    
})();