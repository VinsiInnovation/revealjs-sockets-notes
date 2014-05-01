/*
* NOTES Directives
*/
'use strict';

components.directive('notes', [
  function () {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/notes.html',
    replace: true,
    restrict: 'E',
    priority : 902,
    scope: true,    
    link: function postLink(scope, iElement, iAttrs) { 
        
        scope.iconClass = 'fa-rotate-90';// Icon that show if the note are in full state
        scope.noteFullClass = false; // The class to toggle


        scope.toggleNotes = function(){
          scope.noteFullClass = !scope.noteFullClass;
          scope.iconClass = scope.noteFullClass ? 'fa-rotate-270' : 'fa-rotate-90';
        }
       
    }
  };
  return directiveDefinitionObject;
}]);