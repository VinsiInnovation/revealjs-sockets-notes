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
        $scope.noteFullClass = false;//'';
        $scope.notesPress = true;
        $scope.classNotes = '';
        $scope.classPlugins = 'innactive';
        var full = false;

        $scope.activeFilter = function(plugin){
          return plugin.active;
        }

        $scope.pluginClicked = function(plugin){
          $scope[plugin.id + 'Click']();
          $scope.ui.showMenuClass = 'collapse';
          // If a previous plugin was show, we close it first
          if ($scope.model.currentPluginActiv){
            $scope[$scope.model.currentPluginActiv + 'Close']();
            $scope.ui.showPluginCtrl[$scope.model.currentPluginActiv] = false;
          }
          $scope.ui.showPluginCtrl[plugin.id] = true;
          $scope.model.currentPluginActiv = plugin.id;
        }

        $scope.toggleNotes = function(){
          full = !full;
          $scope.iconClass = full ? 'fa-rotate-270' : 'fa-rotate-90';
          $scope.noteFullClass = full;// ? 'fullSize' : '';
        }

        $scope.toggleNotesPlugins = function(notesPress){
          $scope.notesPress = notesPress;
          $scope.classNotes = $scope.notesPress ? '' : 'innactive';
          $scope.classPlugins = $scope.notesPress ? 'innactive' : '';
        }
    }
  };
  return directiveDefinitionObject;
}]);