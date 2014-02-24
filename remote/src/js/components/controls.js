components.directive('controls', ['$rootScope', '$timeout'
  ,function ($rootScope, $timeout ) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/controls.html',
    replace: true,
    require: '^iframeControl',
    priority : 901,
    restrict: 'E',
    scope: true,    
    link: function postLink($scope, iElement, iAttrs, iframeCtrl) { 

    
      $scope.classShow = '';

      $scope.$watch('model.indices', function(){
        $scope.classShow = '';
        $timeout(function() {
          $scope.classShow = 'hide';
        }, 100);
      });
      
      $scope.leftClick = function($event){
        if (!$event.target.hasAttribute('disabled')) {
          iframeCtrl.revealAction('left');
           $scope.classShow = '';
        }
      }
      
      $scope.rightClick = function($event){
        if (!$event.target.hasAttribute('disabled')) {
          iframeCtrl.revealAction('right');
           $scope.classShow = '';
        }
      }
      
      $scope.upClick = function($event){
        if (!$event.target.hasAttribute('disabled')) {
          iframeCtrl.revealAction('up');
           $scope.classShow = '';
        }
      }
      
      $scope.downClick = function($event){
        if (!$event.target.hasAttribute('disabled')) {
          iframeCtrl.revealAction('down');
           $scope.classShow = '';
        }
      }
      
      $scope.resetClick = function($event){
        if (!$event.target.hasAttribute('disabled')) {
          iframeCtrl.revealAction('reset');
           $scope.classShow = '';
        }
      }
      
      $scope.showClick = function($event){
        if (!$event.target.hasAttribute('disabled')) {
          iframeCtrl.revealAction('next');
          $scope.classShow = '';
          $scope.sendMessage({
              type : 'operation', 
              data : 'show', 
              index: $scope.model.indices, 
              fragment : $scope.model.fragment
          });
        }
      }


      // We add a managment of gesture in order to control the reveal presentation
      $(iElement[0]).hammer().on('release', function(event){
        if (event.gesture && event.gesture.direction && event.gesture.distance > 1){
          $scope.classShow = '';
          if (event.gesture.direction === 'left'){
            iframeCtrl.revealAction('next');
          }else if (event.gesture.direction === 'right'){
            iframeCtrl.revealAction('prev');
          }else if (event.gesture.direction === 'up' && $scope.model.controls.up){
            iframeCtrl.revealAction('down');
          }else if (event.gesture.direction === 'down' && $scope.model.controls.down){
            iframeCtrl.revealAction('up');
          }

        }
      });

     
    }
  };
  return directiveDefinitionObject;
}]);