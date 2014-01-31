components.directive('controls', ['$rootScope'
  ,function ($rootScope ) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/controls.html',
    replace: true,
    require: '^iframeControl',
    restrict: 'E',
    scope: true,    
    link: function postLink($scope, iElement, iAttrs, iframeCtrl) { 

    
      $scope.nextClick = function($event){
        if (!$event.target.hasAttribute('disabled')) 
          iframeCtrl.revealAction('next');
      }
      
      $scope.prevClick = function($event){
        if (!$event.target.hasAttribute('disabled')) 
          iframeCtrl.revealAction('prev');
      }
      
      $scope.leftClick = function($event){
        if (!$event.target.hasAttribute('disabled')) 
          iframeCtrl.revealAction('left');
      }
      
      $scope.rightClick = function($event){
        if (!$event.target.hasAttribute('disabled')) 
          iframeCtrl.revealAction('right');
      }
      
      $scope.upClick = function($event){
        if (!$event.target.hasAttribute('disabled')) 
          iframeCtrl.revealAction('up');
      }
      
      $scope.downClick = function($event){
        if (!$event.target.hasAttribute('disabled')) 
          iframeCtrl.revealAction('down');
      }
      
      $scope.resetClick = function($event){
        if (!$event.target.hasAttribute('disabled')) 
          iframeCtrl.revealAction('reset');
      }
      
      $scope.showClick = function($event){
        if (!$event.target.hasAttribute('disabled')) 
          iframeCtrl.revealAction('next');
        $scope.sendMessage({
            type : 'operation', 
            data : 'show', 
            index: $scope.model.indices, 
            fragment : $scope.model.fragment
        });
      }


     
    }
  };
  return directiveDefinitionObject;
}]);