/*
* PLUGIN Menu (right)
*/
'use strict';

components.directive('pluginMenu', [
  function () {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/pluginmenu.html',
    replace: true,
    priority : 905,
    require: '^sws',
    restrict: 'E',
    scope: true,    
    link: function postLink(scope, iElement, iAttrs, swsControl) { 

      
      /*
      * Plugins
      */

      scope.activeFilter = function(plugin){
        return plugin.active;
      }

      scope.pluginClicked = function(plugin){
        scope[plugin.id + 'Click']();
        scope.ui.showMenuClass = 'collapse';
        // If a previous plugin was show, we close it first
        if (scope.model.currentPluginActiv){
          scope[scope.model.currentPluginActiv + 'Close']();
          scope.ui.showPluginCtrl[scope.model.currentPluginActiv] = false;
        }
        scope.ui.showPluginCtrl[plugin.id] = true;
        scope.model.currentPluginActiv = plugin.id;
      }


    }
  };
  return directiveDefinitionObject;
}]);