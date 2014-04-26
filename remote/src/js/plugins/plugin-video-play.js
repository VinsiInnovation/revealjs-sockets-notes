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

          $scope.ui.excludeArray.push('sws-vp-range-time');

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

          function addRange(id, left){
            var rangeDiv = document.createElement('input');
            rangeDiv.classList.add('sws-plugin-box');
            rangeDiv.classList.add('sws-plugin-vp-range');
            rangeDiv.setAttribute('id', 'sws-vp-range-'+id);
            rangeDiv.setAttribute('type', 'range');
            rangeDiv.setAttribute('value', '0');
            rangeDiv.setAttribute('step', '1');
            rangeDiv.setAttribute('min', '0');
            rangeDiv.setAttribute('max', '100');
            rangeDiv.style.left = left;
            rangeDiv.style.width = '50%';
           return rangeDiv;
          }

          // Add  input type range
          //<input type="range" class="vertical" orient="vertical" />  
          // writing-mode: bt-lr; /* IE */
          //-webkit-appearance: slider-vertical; /* WebKit */
          //width: 8px;
          //height: 200px;
          //padding: 0 5px;

          // use font-awesome fa-volume-up
          // use font awesome fa-step-forward & fa-step-backward 

          var ctrlArea = document.getElementById('sws-plugin-ctrl-vp');
          ctrlArea.appendChild(addBox('play', '#FF0000', 'fa-play','10%'));
          ctrlArea.appendChild(addRange('time','30%'));

          iElement.find('#sws-vp-box-play').bind('click', function(event){
            angular.element(event.target).toggleClass('fa-play');
            angular.element(event.target).toggleClass('fa-pause');
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

      pluginStyleSheet.insertRule('.sws-plugin-vp-range:before {'+
        'content : attr(min); '+
        'position : absolute; '+
        'left : 0; '+
      '}',0);
      
    }
  };
  return directiveDefinitionObject;
}]);