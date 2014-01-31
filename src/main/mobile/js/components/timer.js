components.directive('timer', ['$rootScope'
  ,function ($rootScope) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/timer.html',
    replace: true,
    restrict: 'E',
    scope: false,    
    link: function postLink($scope, iElement, iAttrs) { 

      
      
    }
  };
  return directiveDefinitionObject;
}]);