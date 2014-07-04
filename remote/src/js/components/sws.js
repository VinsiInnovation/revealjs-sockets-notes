/**
* Main Directive
*/
'use strict';

components.directive('sws', ['$rootScope'
  ,function ($rootScope) {
   var directiveDefinitionObject = {
    restrict: 'A',    
    priority : 1000, // It is the hight priority of the app and it have to rest like this
    scope: false,   
    controller: ['$scope',function($scope){
      var revealIframeAction = null;
      // Register the iframe controller for manipulating the reveal presentation in the iframe
      this.registerControl = function(controlRevealDistant){
        revealIframeAction = controlRevealDistant;
      }

      //  Call the reveal action (left / right / next / prev / up / down / show (current indices from scope) / reset (go to slide 0))
      this.revealAction = function(action){
        revealIframeAction(action, $scope);
      }

      var indicesSav = null;
      // Switch the iframe to the same slide as the distant slide
      this.syncToDist = function(){
        if (!indicesSav){
          indicesSav = {
            h : $scope.model.indices.h,
            v : $scope.model.indices.v,
            f : $scope.model.indices.f
          };
          $scope.model.indices.h = $scope.model.indicesDist.h;
          $scope.model.indices.v = $scope.model.indicesDist.v;
          $scope.model.indices.f = $scope.model.indicesDist.f;
          revealIframeAction('show', $scope);
        }
      }

      // Restore the iframe slide to the state it was before sync with distant slide
      this.restoreSlideState = function(){
        if (indicesSav){
          $scope.model.indices.h = indicesSav.h;
          $scope.model.indices.v = indicesSav.v;
          $scope.model.indices.f = indicesSav.f;
          revealIframeAction('show', $scope);
          indicesSav = null;
        }
      }

      // StyleSheet Management  for plugins
      this.createStyleSheet = function(pluginId) {
          // Create the <style> tag
          var style = document.createElement("style");

          // Add a media (and/or media query) here if you'd like!
          style.setAttribute("media", "screen");
          style.setAttribute("id", "style-sheet-sws-plugins-"+pluginId);

          // WebKit hack :(
          style.appendChild(document.createTextNode(""));

          // Add the <style> element to the page
          document.head.appendChild(style);

          return style.sheet ? style.sheet : style.styleSheet;
        }

    }], 
    link: function postLink(scope, iElement, iAttrs) { 


        var socketIO = null;
        

       /*
        * Model
        */
        scope.model = {
          defaultInterval : 60, // Time in minute of the conference
          limitAlert : 1, // time before the end where we have to alert the speaker (if defaultInterval is upper limitAlert)
          totalTime : 0, // Total time ellapsed during the presentation
          socket : null, // The webSocket
          localUrl : null, // var in order to see if the presentation has already be loaded    
          currentPluginActiv : null, // The id of the currentPlugin
          indicesDist : {
              h : 0,
              v : 0
          }, // Basic initialization for presentation on client side
          indices : {
              h : 0,
              v : 0
          }, // Basic initialization of indices of reveal presentation
          currentSlideNumber : 1, // current slide number on client side
          nextSlideNumber : 1, // next slide number on preview 
          nbSlides : 0, // Total Number of slides        
          mapPosition : {}, // The position of slide according to indexs
          conf : {}, // Configuration corresponding to server
          pluginList : [] // List of plugin of application
        };

        /*
        * UI interactions
        */
        scope.ui = {
          timeStart : false, // true if the time loader is on
          couldUnlock : false, // true if the client is ready for websocket control
          showControls : true, // var to know if the iframe was load
          iframeLoad : false, // var to know if the iframe was load
          showMenuClass : 'collapse', // expand if we show the menu / collapse else
          showPlugin : false, // true to show the plugin area          
          excludeArray : ['controls','show','back'], // Array of id to exclude
          showPluginCtrl : {}, // List of ui Elements that are corresponding to plugins identify by id of plugin
          controls : {
            reset : true,
            show : true,
            up : true,
            down : true,
            left : true,
            right : true,
            next :  true,
            prev : true
          }, // Controls values
          controlsColor : 'white',
          contentNotes : '', // the notes of current slide
        }

        /*
        * Compatibilities needed for the application
        */
        scope.compatibility = {
          fullScreen : Modernizr.fullscreen,
          webSockets : Modernizr.websockets,
          cssCalc : Modernizr.csscalc,
          cssAnimation : Modernizr.cssanimations,
          mediaQuieries : Modernizr.mediaquieries
        }

        /*
        * Methods
        */

        function onMessage(json){
          // Message send when recieving notes
          if (json.type === "notes"){                   
            if( json.data.markdown ) {
              scope.ui.contentNotes = marked( json.data.notes );
            }
            else {
              scope.ui.contentNotes =  json.data.notes;
            }                              
          }else  // Message recieve on each change of slide
            if (json.type === "config"){    
              // We unlock the presentation if we have a client
              if (!scope.ui.couldUnlock){
                $("#show").removeAttr("disabled");
              }
              scope.ui.couldUnlock = scope.ui.couldUnlock || true;
              // If we have to load the speaker slide versions (recieve the url of presentation)
              if (json.url && !scope.model.localUrl){
                scope.model.localUrl = "http://"+window.location.hostname+":"+scope.model.conf.port+json.url;

                $rootScope.$broadcast('loadIframeEvt', scope.model.localUrl);
                  
                scope.model.nbSlides = json.nbSlides;
                scope.model.mapPosition = json.mapPosition;

                scope.ui.controlsColor = json.controlsColor;
              }else  // If we recieve the index of presentation
                if (json.indices){
                    scope.model.indicesDist = json.indices;
                    scope.model.currentSlideNumber = scope.model.mapPosition[scope.model.indicesDist.h+'-'+scope.model.indicesDist.v];  
                }
              }else if (json.type === 'plugin'){
                if (json.action === 'activate'){
                  for (var i = 0; i < scope.model.pluginList.length; i++){
                    var plugin = scope.model.pluginList[i];
                    if (plugin.id === json.id){
                      plugin.active = true;
                    }
                  }
                }
              }

        }

       
        /*
        * Services
        */

        //This method connect the app to the webSocket
        scope.connect = function(){                
            if ( typeof io != 'undefined'){                
                socketIO = io.connect('http://'+window.location.hostname+':'+scope.model.conf.port);
                
                // Socket IO connect
                socketIO.on('connect',function(){
                    // Send a ping message for getting config
                   socketIO.emit('message', {
                       type:'ping'
                   }); 

                   
                   // Ask for plugins
                   socketIO.emit('message', {
                       type:'ping-plugin'
                   }); 
                    
                });
             

                // Message from presentation
                socketIO.on("message", function(json){
                    $rootScope.$apply(function(){
                        onMessage(json);
                    });
                });
            }
        }


        // This method send a message through the websocket
        scope.sendMessage = function(message){
            socketIO.emit('message', message);
        }

        // This method manage the communication between plugins
        scope.pluginCommunication = function(id, data){
          socketIO.emit('message', {
              type : 'communicate-plugin',
              'id'  : id,
              'data': data
          }); 
        }
         
        // This method register a plugin 
        scope.register = function(plugin){
          plugin.active = false;
          scope.model.pluginList.push(plugin);
          scope.ui.showPluginCtrl[plugin.id] = false;
        }

      }
  };
  return directiveDefinitionObject;
}]);