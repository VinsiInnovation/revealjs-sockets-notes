/*
* PARAM Menu (left)
*/
'use strict';

components.directive('paramMenu', ['$rootScope'
  ,function ($rootScope) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/parammenu.html',
    replace: true,
    priority : 906,
    require: '^sws',
    restrict: 'E',
    scope: true,    
    transclude : true,
    link: function postLink(scope, iElement, iAttrs, swsControl) { 

      
      /*
      * Menu Actions
      */

      scope.playText = 'Play'; // The text of play button ('play' or 'pause')
      scope.showPlay = true; // True if the play button display the play icon, false if display the pause icon

      scope.stop = function(){
        $rootScope.$broadcast('resetTimer');  
      }

      scope.playPause = function(){
        scope.showPlay = !scope.showPlay;
        scope.playText = scope.showPlay ? 'Play' : 'Pause';
        $rootScope.$broadcast('playPauseTimer', {play : !scope.showPlay});  
      }

      scope.reset = function(){
        swsControl.revealAction('reset')
        scope.ui.showMenuClass = 'collapse';
      }


      scope.fullscreen = function(){
        if (document.fullscreenElement || 
            document.webkitFullscreenElement ||
            document.mozFullScreenElement){
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }else{
            var docElm = document.getElementById("main-content");
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            }
            else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            }
            else if (docElm.webkitRequestFullscreen) {
                docElm.webkitRequestFullscreen();
            }
        }
      }

    
    }
  };
  return directiveDefinitionObject;
}]);