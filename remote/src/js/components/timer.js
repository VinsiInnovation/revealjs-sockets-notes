components.directive('timer', ['$rootScope', '$interval'
  ,function ($rootScope, $interval) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/timer.html',
    replace: true,
    restrict: 'E',
    priority : 904,
    scope: true,    
    link: function postLink($scope, iElement, iAttrs) { 

      navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

      $scope.showPlay = true;
      $scope.showTime = true;
      $scope.hours = "00";
      $scope.minutes = "00";
      $scope.seconds = "00";
      $scope.classHours = "mute";
      $scope.classMinutes = "mute";
      $scope.interval = 60;

      var progressEl = iElement.find('div.elapsed_bg');

      $scope.toggleTime = function(){
        $scope.showTime = !$scope.showTime;
      }

      $scope.play = function(){
        $scope.showPlay = false;
        start  = new Date();
        $scope.ui.timeStart = true;
      }

      $scope.pause = function(){
        $scope.showPlay = true;
        $scope.ui.timeStart = false;
        $scope.model.totalTime = $scope.model.totalTime + (new Date().getTime() - start.getTime());
      }

      $scope.stop = function(){
        $scope.showPlay = true;
        $scope.ui.timeStart = false;
        $scope.model.totalTime  = 0;
        renderProgress(0);
        $scope.hours = "00";
        $scope.minutes = "00";
        $scope.seconds = "00";
        $scope.classHours = "mute";
        $scope.classMinutes = "mute";
      }

      $scope.validate = function(){
        $scope.toggleTime();
        $scope.model.defaultInterval = $scope.interval;
      }

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
          if ($scope.ui.timeStart){
              var now = new Date();
              diff = now.getTime() - start.getTime();
              $scope.model.defaultInterval = $scope.model.defaultInterval > 0 ? $scope.model.defaultInterval : 60;
              var totalDiff = diff + $scope.model.totalTime;
              var alertTime = ($scope.model.defaultInterval * 60 * 1000) - ($scope.model.limitAlert * 60 * 1000);
              hours = parseInt( totalDiff / ( 1000 * 60 * 60 ) );
              minutes = parseInt( ( totalDiff / ( 1000 * 60 ) ) % 60 );
              seconds = parseInt( ( totalDiff / 1000 ) % 60 );
          
              $scope.hours = zeroPadInteger( hours );
              if (hours > 0 && $scope.classHours === 'mute')
                  $scope.classHours = '';
              else if(hours === 0 && $scope.classHours != 'mute')
                  $scope.classHours = 'mute';
              
              $scope.minutes = zeroPadInteger( minutes );
              if (minutes > 0 && $scope.classMinutes === 'mute')
                  $scope.classMinutes = '';
              else if(minutes === 0 && $scope.classMinutes != 'mute')
                  $scope.classMinutes = 'mute';
              
              $scope.seconds = zeroPadInteger( seconds );
              
              var diffPercent = (totalDiff / ($scope.model.defaultInterval * 60 * 1000)) * 100;                
              renderProgress(Math.min(diffPercent, 100));
              
          }
      }, 1000 );
      
      renderProgress(0);

    }
  };
  return directiveDefinitionObject;
}]);