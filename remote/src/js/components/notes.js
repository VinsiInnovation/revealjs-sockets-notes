components.directive('notes', ['$rootScope'
  ,function ($rootScope) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/notes.html',
    replace: true,
    restrict: 'E',
    priority : 902,
    scope: true,    
    link: function postLink($scope, iElement, iAttrs) { 
        $scope.iconClass = 'fa-rotate-90';
        $scope.noteFullClass = '';
        var full = false;

        $scope.toggleNotes = function(){
          full = !full;
          $scope.iconClass = full ? 'fa-rotate-270' : 'fa-rotate-90';
          $scope.noteFullClass = full ? 'fullSize' : '';
        }
    }
  };
  return directiveDefinitionObject;
}]);