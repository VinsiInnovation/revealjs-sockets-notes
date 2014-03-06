components.directive('iframeControl', ['$rootScope', '$timeout'
  ,function ($rootScope, $timeout ) {

    
   var revealIFrame = null;

   var revealIFrameAction = function(action, $scope){
      if (action === 'next'){
        revealIFrame.next();
      }else if (action === 'prev'){
        revealIFrame.prev();          
      }else if (action === 'up'){
        revealIFrame.up();          
      }else if (action === 'down'){
        revealIFrame.down();          
      }else if (action === 'left'){
        revealIFrame.left();          
      }else if (action === 'right'){
        revealIFrame.right();          
      }else if (action === 'reset'){
        revealIFrame.slide( 0, 0, 0 );          
      }else if (action === 'show'){
        revealIFrame.slide( $scope.model.indices.h, $scope.model.indices.v, 0 );          
      }
   }

   var directiveDefinitionObject = {
    restrict: 'A',
    require: '^sws',
    priority : 950,
    scope: false,    
    controller: function($scope){

      this.revealAction = function(action){
        revealIFrameAction(action,$scope);
        /*if (action === 'next'){
          revealIFrame.next();
        }else if (action === 'prev'){
          revealIFrame.prev();          
        }else if (action === 'up'){
          revealIFrame.up();          
        }else if (action === 'down'){
          revealIFrame.down();          
        }else if (action === 'left'){
          revealIFrame.left();          
        }else if (action === 'right'){
          revealIFrame.right();          
        }else if (action === 'reset'){
          revealIFrame.slide( 0, 0, 0 );          
        }else if (action === 'show'){
          revealIFrame.slide( $scope.model.indices.h, $scope.model.indices.v, 0 );          
        }*/
      }
    },
    link: function postLink($scope, iElement, iAttrs, swsControl) { 

      swsControl.registerControl(revealIFrameAction);

      var iframe = iElement.find('iframe')[0];

      $rootScope.$on('loadIframeEvt', function(evt, url){
        iframe.src = url;
      });  

      // We specify in localstorage that we are in a remote control context
      document.body.setAttribute('sws-remote-iframe-desactiv', true);

      // Scope method

      var updateControls = function(){
        var controls = iframe.contentDocument.querySelector('.controls');
        var upControl = true,
            downControl = true,
            leftControl = true,
            rightControl = true;                
        if (controls){
            controls.style.display = "none";
            upControl = controls.querySelector("div.navigate-up.enabled") ? false : true;
            downControl = controls.querySelector("div.navigate-down.enabled") ? false : true;
            leftControl = controls.querySelector("div.navigate-left.enabled") ? false : true;
            rightControl = controls.querySelector("div.navigate-right.enabled") ? false : true;
        }
        $scope.ui.controls = {
            reset : false,
            show : false,
            up : upControl,
            down : downControl,
            left : leftControl,
            right : rightControl,
            next :  $scope.model.indices.h+$scope.model.indices.v+1 > $scope.model.nbSlides,
            prev : $scope.model.indices.h+$scope.model.indices.v <= 0
        };

      }

      // Directive Methods

      var onIFrameLoad = function(){
        console.log('IFrame load ! ');
        revealIFrame = iframe.contentWindow.Reveal;
        // Configuration of presentation to hide controls
        revealIFrame.initialize({
            controls: true,
            transition : 'default',
            transitionSpeed : 'fast',
            history : false,
            slideNumber: false,
            keyboard: false,
            touch: false,
            embedded : true
        });
        
        // We listen to reaveal events in order to ajust the screen
        revealIFrame.addEventListener( 'slidechanged', revealChangeListener);
        revealIFrame.addEventListener( 'fragmentshown', revealFragementShowListener);
        revealIFrame.addEventListener( 'fragmenthidden', revealFragementHiddeListener);
        
        updateControls();
        $scope.ui.iframeLoad = true;

      }

      var revealChangeListener = function(event){
         $timeout(function(){          
            $scope.model.indices = revealIFrame.getIndices();
            $scope.model.nextSlideNumber = $scope.model.indices.h+$scope.model.indices.v;
            updateControls();
          }, 500);    
      }


      var revealFragementShowListener = function(event){
          $scope.model.fragment++;
      }


      var revealFragementHiddeListener = function(event){
          $scope.model.fragment = Math.min(0, $scope.model.fragment++);
      }

      iframe.onload = onIFrameLoad;
      
    }
  };
  return directiveDefinitionObject;
}]);