/*
* Action Bar directive
*/
'use strict'

components.directive('actionBar', ['$rootScope', '$interval'
  ,function ($rootScope, $interval) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/actionbar.html',
    replace: true,
    priority : 900,
    restrict: 'E',
    scope: true,    
    link: function postLink(scope, iElement, iAttrs) { 

      
      scope.showTime = true;
      scope.showHours = false;
      scope.hours = "00";
      scope.minutes = "00";
      scope.seconds = "00";
      scope.classHours = "mute";
      scope.classMinutes = "mute";
      scope.interval = 60;

      var progressEl = iElement.find('div.elapsed_time');

      scope.toggleTime = function(){
        scope.showTime = !scope.showTime;
      }

      scope.toggleMenu = function(){
        scope.ui.showMenuClass = scope.ui.showMenuClass === 'collapse' ? 'expand-menu' : 'collapse';
      }

      scope.toggleMenuPlugin = function(){
        scope.ui.showMenuClass = scope.ui.showMenuClass === 'collapse' ? 'expand-plugin' : 'collapse';
      }

      scope.play = function(){        
        start  = new Date();
        scope.ui.timeStart = true;
      }

      scope.pause = function(){
        scope.ui.timeStart = false;
        scope.model.totalTime = scope.model.totalTime + (new Date().getTime() - start.getTime());
      }

      $rootScope.$on('resetTimer', function(){
        scope.showPlay = true;
        scope.ui.timeStart = false;
        scope.model.totalTime  = 0;
        renderProgress(0);
        scope.hours = "00";
        scope.minutes = "00";
        scope.seconds = "00";
        scope.classHours = "mute";
        scope.showHours = false;
        scope.classMinutes = "mute";
      });

      $rootScope.$on('playPauseTimer', function(event, data){
        if(data.play){
          scope.play();
        }else{
          scope.pause();
        }
      });

      scope.validate = function(){
        scope.toggleTime();
        scope.model.defaultInterval = scope.interval;
      }

      // We add a gesture to switch to fullscreen
      $(iElement[0]).hammer().on('release', function(event){
        if (event.gesture && event.gesture.direction && event.gesture.distance > 1){
          if (event.gesture.direction === 'up'){
            // We to toggle to fullscreen
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
          }else if (event.gesture.direction === 'down'){
            // We exit fullscreen
            if (document.fullscreenElement || 
                document.webkitFullscreenElement ||
                document.mozFullscreenElement){
              if (document.exitFullscreen) {
                  document.exitFullscreen();
              }
              else if (document.mozCancelFullScreen) {
                  document.mozCancelFullScreen();
              }
              else if (document.webkitExitFullscreen) {
                  document.webkitExitFullscreen();
              }
            }
          }
        }
      });

      // Time Management
      var start = new Date();
      var fullTime = false;
        
      function renderProgress(progress){
        progress = Math.floor(progress);
        progressEl.css("width", progress+"%");
        var alertClass = progressEl.hasClass("alert");
        var advancedClass = progressEl.hasClass("advanced");
        if (progress < 75 && (alertClass || advancedClass)){
          fullTime = false;
          progressEl.removeClass("alert");
          progressEl.removeClass("advanced");
        }else if(progress >= 75 && progress < 90 && !advancedClass){
          fullTime = false;
          if (navigator.vibrate){
            navigator.vibrate(100);
          }
          progressEl.addClass("advanced");
          progressEl.removeClass("alert");
        }else if(progress >= 90 && !alertClass){
          fullTime = false;
          if (navigator.vibrate){
            navigator.vibrate(500);
          }
          progressEl.addClass("alert");
          progressEl.removeClass("advanced");
        }else if (progress === 100 && !fullTime && navigator.vibrate){
          fullTime = true;
          navigator.vibrate(1000);
        }
      }

      function zeroPadInteger(num){
        var str = "00" + parseInt( num );
        return str.substring( str.length - 2 );
      }
      
      // Time interval for management of time
      $interval( function() {
      
          var diff, 
              hours, 
              minutes, 
              seconds;                
          if (scope.ui.timeStart){
              var now = new Date();
              diff = now.getTime() - start.getTime();
              scope.model.defaultInterval = scope.model.defaultInterval > 0 ? scope.model.defaultInterval : 60;
              var totalDiff = diff + scope.model.totalTime;
              var alertTime = (scope.model.defaultInterval * 60 * 1000) - (scope.model.limitAlert * 60 * 1000);
              hours = parseInt( totalDiff / ( 1000 * 60 * 60 ) );
              minutes = parseInt( ( totalDiff / ( 1000 * 60 ) ) % 60 );
              seconds = parseInt( ( totalDiff / 1000 ) % 60 );
          
              scope.hours = zeroPadInteger( hours );
              if (hours > 0 && scope.classHours === 'mute'){

                  scope.classHours = '';
                  scope.showHours = true;
              }else if(hours === 0 && scope.classHours != 'mute'){
                  scope.classHours = 'mute';
                  scope.showHours = false;
              }
              
              scope.minutes = zeroPadInteger( minutes );
              if (minutes > 0 && scope.classMinutes === 'mute')
                  scope.classMinutes = '';
              else if(minutes === 0 && scope.classMinutes != 'mute')
                  scope.classMinutes = 'mute';
              
              scope.seconds = zeroPadInteger( seconds );
              
              var diffPercent = (totalDiff / (scope.model.defaultInterval * 60 * 1000)) * 100;                
              renderProgress(Math.min(diffPercent, 100));
              
          }
      }, 1000 );
      
      renderProgress(0);
      
    }
  };
  return directiveDefinitionObject;
}]);