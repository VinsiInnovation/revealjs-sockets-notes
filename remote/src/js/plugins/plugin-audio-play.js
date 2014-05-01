/*
* Audio Play plugin
*/
'use strict';

plugins.directive('apPlugin', [
  function () {
   var directiveDefinitionObject = {
    restrict: 'A',
    require: '^sws',
    priority : 101,
    scope: false,    
    link: function postLink(scope, iElement, iAttrs, swsControl) { 

      scope.register({
        name : 'play audio',
        icon : 'fa-music',
        id : 'ap'
      });

      // We add color div to change the color of pointer
      function addBox(id, color, icon, left){
        var boxDiv = document.createElement('DIV');
        boxDiv.setAttribute('id', 'sws-ap-box-'+id);
        boxDiv.classList.add('sws-plugin-box');
        boxDiv.classList.add('sws-plugin-ap-box');
        boxDiv.style.left = left;
        if (icon){              
          boxDiv.classList.add('fa');
          boxDiv.classList.add(icon);
        }else{
          boxDiv.classList.add('color');              
          boxDiv.classList.add(id);              
        }
        return boxDiv;
      }

      var init = false;
      scope.apClose = function(){
        swsControl.restoreSlideState();
      }

      scope.apClick = function(){

        if (!init){

          init = true;
          
          var ctrlArea = document.querySelector('#sws-plugin-ctrl-ap .sws-plugin-ctrl');
          ctrlArea.appendChild(addBox('play', '#FF0000', 'fa-play','50%'));

          iElement.find('#sws-ap-box-play').bind('click', function(){
            scope.pluginCommunication('ap', {});  
          });
        }
        
        
        swsControl.syncToDist();
        scope.ui.showControls = false;
        scope.ui.showPlugin = true;
      }

      /*
      **************************************
      **************************************
      * Style Sheet Management
      **************************************
      **************************************
      */
      
      var size = 40;      

      var pluginStyleSheet = swsControl.createStyleSheet('ap');

      

    }
  };
  return directiveDefinitionObject;
}]);