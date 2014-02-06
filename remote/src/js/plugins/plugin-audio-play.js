/*
* Audio Play plugin
*/
plugins.directive('apPlugin', ['$rootScope'
  ,function ($rootScope) {
   var directiveDefinitionObject = {
    restrict: 'A',
    priority : 101,
    scope: false,    
    link: function postLink($scope, iElement, iAttrs) { 

      $scope.register({
        name : 'play audio',
        icon : 'fa-music',
        id : 'ap'
      });


      $scope.apClick = function(){
        $scope.pluginCommunication('ap', {});
      }
    }
  };
  return directiveDefinitionObject;
}]);