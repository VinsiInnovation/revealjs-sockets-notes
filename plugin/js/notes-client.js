/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 */
var RevealClientNotes = (function() {


	var socket = null;
    var showModif = window.location.hash === '#speakerNotes';

	
	function initWS(){
	  socket = io.connect('http://'+window.location.hostname+':8080');
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
		    socket.emit('message', {type :"config", url : window.location.pathname});
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
		initWS();
		initRevealListener();
	}

	return { init: init };
})();

RevealClientNotes.init();

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();
