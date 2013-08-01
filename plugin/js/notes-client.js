/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 */
var RevealClientNotes = (function() {


    var conf = null;
	var socket = null;
    var showModif = window.location.hash === '#speakerNotes';

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

    
    function initConfig(){
          ajaxJSONGet('./plugin/sockets-notes/conf/conf.json', function(data){    
              conf = data;
              initWS();
          });
    }
    
	
	function initWS(){
          // Read configuration file for getting server port
            
        socket = io.connect('http://'+window.location.hostname+':'+conf.port);
        socket.on('connect', function(){            
           socket.emit('message', {type :"config", url : window.location.pathname});
        });
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
                var nbSlides = 0;
                var continueLoop = true;
                while(continueLoop){
                    nbSlides++;                
                    continueLoop = Reveal.getSlide(nbSlides);
                }
                socket.emit('message', {type :"config", url : window.location.pathname, nbSlides : nbSlides-1});
                socket.emit('message', {type :"config", indices : Reveal.getIndices()});
            }
        });
	}


	function initRevealListener(){

		Reveal.addEventListener( 'slidechanged', function( event ) {
			var slideElement = Reveal.getCurrentSlide(),
				messageData;
			
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

			messageData = {
				notes : notes ? notes.innerHTML : '',
				indexh : indexh,
				indexv : indexv,
				nextindexh : nextindexh,
				nextindexv : nextindexv,
				markdown : notes ? typeof notes.getAttribute( 'data-markdown' ) === 'string' : false
			};

			if (!showModif && socket &&  messageData.notes !== undefined) {
				socket.emit('message', {type : 'notes', data : messageData});				
			}
            if (showModif && socket){
                socket.emit("message", {type:'config', indices : Reveal.getIndices()});
            }			
			
		} );
        
        Reveal.addEventListener( 'fragmentshown', function( event ) {
            socket.emit("message", {type:'config', fragment : '+1'});
        } );
        Reveal.addEventListener( 'fragmenthidden', function( event ) {
            socket.emit("message", {type:'config', fragment : '-1'});
        } );
	}

	function init(){
		initConfig();
		initRevealListener();
	}

	return { init: init };
})();

RevealClientNotes.init();
