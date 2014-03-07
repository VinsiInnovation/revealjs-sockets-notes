/*
* Video Play plugin
*/
plugins.directive('vpPlugin', ['$rootScope'
  ,function ($rootScope) {
   var directiveDefinitionObject = {
    restrict: 'A',
    require: '^sws',
    priority : 100,
    scope: false,    
    link: function postLink($scope, iElement, iAttrs, swsControl) { 

      $scope.register({
        name : 'play video',
        icon : 'fa-youtube-play',
        id : 'vp'
      });

      var init = false;
      $scope.vpClose = function(){
        swsControl.restoreSlideState();
      }

      $scope.vpClick = function(){
        if (!init){

          init = true;
          // We add color div to change the color of pointer
          function addBox(id, color, icon, left){
            var boxDiv = document.createElement('DIV');
            boxDiv.setAttribute('id', 'sws-vp-box-'+id);
            boxDiv.classList.add('sws-plugin-box');
            boxDiv.classList.add('sws-plugin-vp-box');
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

          var ctrlArea = document.getElementById('sws-plugin-ctrl-vp');
          ctrlArea.appendChild(addBox('play', '#FF0000', 'fa-play','50%'));

          iElement.find('#sws-vp-box-play').bind('click', function(){
            $scope.pluginCommunication('vp', {});  
          });
        }
        

        swsControl.syncToDist();
        $scope.ui.showControls = false;
        $scope.ui.showPlugin = true;
        $scope.pluginCommunication('vp', {});
      }


       /*
      **************************************
      **************************************
      * Style Sheet Management
      **************************************
      **************************************
      */
      
      var size = 40;      

      var pluginStyleSheet = swsControl.createStyleSheet('vp');
      
    }
  };
  return directiveDefinitionObject;
}]);