'use strict';

/*
* Reveal Sockets Notes : Plugin Client V1.0.0
*
*/

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

        for(var idx = 0; idx < scripts.length; idx++)
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
    additionnalConfiguration = null,
    socket = null,
    ips = null,
    qrCode = null,
    pluginList = {},
    VERSION = '1.0.0';

  /*
  * **************************************
  * ---------INNER METHODS----------------
  * **************************************
  */
  
  // We init the client side (websocket + reveal Listener)
	var init = function(conf){

    // We check if this script ins't in the iframe of the remote control
    if(!window.parent || !window.parent.document.body.getAttribute('sws-remote-iframe-desactiv')){
        console.log('Initialize Client side');
        additionnalConfiguration = conf;
        checkAdditionnalConfiguration();
        initConfig();
        initRevealListener();
    }        
  };    

  var checkAdditionnalConfiguration = function(){
    if (!additionnalConfiguration){
      additionnalConfiguration = {};
    }

    if (!additionnalConfiguration.controlsColor){
      additionnalConfiguration.controlsColor = 'white';
    }
  };
  
  // Initialise with the configuration file
  var initConfig = function(){
        UtilClientNotes.ajaxJSONGet(UtilClientNotes.extractPath()+'/reveal_plugin/conf/conf.json', function(data){    
            conf = data;
            initWS();
            loadAdditionnalScripts();
        });

        // We also list the ips file
        UtilClientNotes.ajaxJSONGet(UtilClientNotes.extractPath()+'/reveal_plugin/conf/ips.json', function(data) {
          ips = data;
        });

        document.onkeydown = keyPress;
      
  };    	

  // Use to detect the call of server presentation
  var keyPress = function(e){
    var evtobj = window.event? event : e
    //keyCode = 80 = q for QRCode
    if (evtobj.keyCode === 81 && evtobj.ctrlKey) showRemoteQrCode();
  }


  var showRemoteQrCode = function(){

    // We show the qrcode for the phone
    if (!document.querySelector('#sws-show-qr-code')){
      var container = document.createElement('DIV');
      container.setAttribute('id', 'sws-show-qr-code');
      container.innerHTML = '<div id="sws-show-qr-header">'+
        '<h1 class="title">Choose, Generate and Scan !</h1><div class="close"> "Ctrl+Q" to hide</div>'+
        '<p>Choose the right network interface and click on \'Generate\' button</p>'+
        '<div id="listIp"></div>'+
        '</div>'+
        '<div id="sws-show-qr-bottom">'+
        '<a id="qrCodeLink"><div id="qrCode"></div></a>'+
        '<h1>Scan with your phone</h1>'+
        '<div id="sws-show-qr-url"></div>'+
        '</div>';

      document.body.appendChild(container);
      qrCode = new QRCode("qrCode", {
            text: "",
            width: 256,
            height: 256,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
      var list = "<select id='sws-show-qr-code-select'>";
      for (var i = 0; i < ips.length; i++){
          list+= "<option value='"+ips[i].id+"' id='ip"+ips[i].id+"' index='"+ips[i].id+"' >"+ips[i].name+"</option>";                
      }
      list += "</select>";
      list += "<button id='sws-show-qr-code-generate'>Generate</button>";
      document.querySelector('#listIp').innerHTML = list;
      var pathPlugin = UtilClientNotes.extractPath();
      document.querySelector('#sws-show-qr-code-generate').addEventListener('click', function(event){
        var get_id = document.getElementById('sws-show-qr-code-select');
        var result = get_id.options[get_id.selectedIndex].value;
        var urlRemote = "http://"+ips[result].ip // HOST
          +":"+conf.port // PORT
          +pathPlugin.substr(pathPlugin.indexOf(conf.port)+(''+conf.port).length, pathPlugin.length) // PATHNAME
          +(conf.devMode ?"remote/src/" : "remote/")+"notes-speaker.html";
        qrCode.clear();
        qrCode.makeCode(urlRemote);
        document.querySelector("#qrCodeLink").setAttribute("href",urlRemote);
        document.querySelector("#sws-show-qr-url").innerHTML = '<span style="text-transform:uppercase; font-weight:bold;">Or goto : </span><br>'+urlRemote;
      });
      
    }

    var area = document.querySelector('#sws-show-qr-code');
    area.style.display= area.style.display === 'none' ? '' : 'none';

  }

  /**
   * Converts the target object to an array.
   */
  var toArray = function( o ) {

    return Array.prototype.slice.call( o );

  }


  /**
  *  Return the number of slides of the presentation and gives a mapping of position for each index
  */
  var countNbSlides = function(){
    var totalSlides = 0;
    var mapPosition = {};

    // Method take from revealJS lib and rearange

    var HORIZONTAL_SLIDES_SELECTOR = '.reveal .slides>section',
      SLIDES_SELECTOR = '.reveal .slides section';

    var horizontalSlides = toArray( document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

    // The number of past and total slides
    var totalCount = document.querySelectorAll( SLIDES_SELECTOR + ':not(.stack)' ).length;    

    // Step through all slides and count the past ones
    for( var i = 0; i < horizontalSlides.length; i++ ) {
      var horizontalSlide = horizontalSlides[i];
      var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) );
      if (verticalSlides.length >0){
        for (var j = 0; j < verticalSlides.length; j++){
          mapPosition[i+'-'+j] = totalSlides+j+1;  
        }
      }else{
        mapPosition[i+'-0'] = totalSlides+1;
      }
      totalSlides += verticalSlides.length > 0 ? verticalSlides.length : 1;
    }

    return {
      nbSlides : totalSlides,
      map : mapPosition
    }
  }
  
  // Init the WebSocket connection
	var initWS = function(){
        // Get the number of slides

        var confNbSlides = countNbSlides();      
        
        // Connect to websocket
        socket = io.connect('http://'+window.location.hostname+':'+conf.port);
        // On Connection message
        socket.on('connect', function(){            
            socket.emit('message', {
               type :"config", 
               url : window.location.pathname, 
               controlsColor : additionnalConfiguration.controlsColor,
               nbSlides : confNbSlides.nbSlides, 
               mapPosition : confNbSlides.map
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
                Reveal.slide( data.index.h, data.index.v, data.index.f ? data.index.f : 0 );
            }else if( data.type === "ping"){	  		               

                if (document.querySelector('#sws-show-qr-code')){
                  document.querySelector('#sws-show-qr-code').style.display = 'none';
                }

                // We have to check the controls in order to show the correct directions              
                socket.emit('message', {
                    type :"config", 
                    url : window.location.pathname, 
                    controlsColor : additionnalConfiguration.controlsColor,
                    nbSlides : confNbSlides.nbSlides, 
                    mapPosition : confNbSlides.map
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
    var notes = slideElement.querySelector( 'aside.notes' );

    // We prepare the message data to send through websocket
    messageData = {
      notes : notes ? notes.innerHTML : '',
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

  // Function that load a script
  var loadScript = function(url){
    var js_script = document.createElement('script');
    js_script.type = "text/javascript";
    js_script.src = url;
    js_script.async = true;
    document.getElementsByTagName('head')[0].appendChild(js_script);
  }

  // Function that load a script
  var loadCss = function(url){
    var css_script = document.createElement('link');
    css_script.rel = "stylesheet";
    css_script.type = "text/css";    
    css_script.href = url;
    css_script.media = 'all';
    css_script.async = true;
    document.getElementsByTagName('head')[0].appendChild(css_script);
  }

  // Load all the additionnals javascript libraries needed (QrCode)
  var loadAdditionnalScripts = function(){
    var path = UtilClientNotes.extractPath()+'reveal_plugin/'+(conf.devMode ? 'src/' : '');
    loadScript(path+'components/qrcode/qrcode.min.js');
    loadCss(path+'css/main.css');
  }

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

  //init();

  return {
    registerPlugin : registerPlugin, 
    init : init
  };
    
})();