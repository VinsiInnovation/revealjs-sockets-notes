/*
* Remote pointer plugin
*/
plugins.directive('rpPlugin', ['$rootScope'
  ,function ($rootScope) {
   var directiveDefinitionObject = {
    restrict: 'A',
    priority : 102,
    scope: false,    
    link: function postLink($scope, iElement, iAttrs) { 

      $scope.register({
        name : 'remote pointer',
        icon : 'fa-pencil',
        id : 'rp'
      });

      var previewElement = iElement.find('#preview');
      var areaPointer = null;

      function touchFeedback(event){
        if (event.gesture && event.gesture.center){
          console.log(event.gesture.center.pageX);
          $scope.pluginCommunication('rp', {
            hide : false,
            x : Math.round(event.gesture.center.pageX / previewElement.width()),
            y : Math.round(event.gesture.center.pageY / previewElement.height())
          });
        }
      }


      $scope.rpClick = function(){

        if (!areaPointer){
          areaPointer = document.createElement('DIV');
          areaPointer.style.position = 'absolute';
          areaPointer.style.width = previewElement.width()+'px';
          areaPointer.style.height = previewElement.height()+'px';
          areaPointer.style.top = previewElement.position().top+'px';
          areaPointer.style.left = previewElement.position().left+'px';
          areaPointer.style['margin'] = '10px';
          areaPointer.style['margin-top'] = '5px';          
          areaPointer.style['background-color'] = 'rgba(0,0,0,0)';
          areaPointer.style.border = 'solid red 5px';

          iElement.find('#main-content')[0].appendChild(areaPointer);
        }

        $(areaPointer).hammer().off('drag', touchFeedback);
        $(areaPointer).hammer().on('drag', touchFeedback);

      }
    }
  };
  return directiveDefinitionObject;
}]);