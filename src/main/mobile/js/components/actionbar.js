components.directive('actionBar', ['$rootScope','$location'
  ,function (model, $rootScope,$location) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/actionbar.html',
    replace: true,
    restrict: 'E',
    scope: {        
    },    
    link: function postLink($scope, iElement, iAttrs) { 

      
    }
  };
  return directiveDefinitionObject;
}]);