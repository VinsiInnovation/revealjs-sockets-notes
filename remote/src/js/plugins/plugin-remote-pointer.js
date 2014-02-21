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
      var notesElement = null;
      var areaPointer = null;
      var currentColor = 'red';

      function touchFeedback(event){
        if (event.gesture && event.gesture.center){
          // We get the position of finger on page, and we have to calculate it's position on preview area
          var x = event.gesture.center.pageX,
              y = event.gesture.center.pageY,
              rect = previewElement[0].getClientRects()[0];

          var percentX = ((x-rect.left) / rect.width) * 100;
          var percentY = ((y-rect.top) / rect.height) * 100;
          //console.log((event.gesture.center.pageX / previewElement.width())+ '|'+ Math.round(event.gesture.center.pageX / previewElement.width()));
          $scope.pluginCommunication('rp', {
            hide : false,
            x : Math.round(percentX),
            y : Math.round(percentY),
            color : currentColor
          });
        }
      }

      function boxClicked(event){
        if (event.target.id === 'sws-rp-box-close'){
          $(areaPointer).hammer().off('drag', touchFeedback);
          areaPointer.style.display = 'none';
          notesElement.css('top','');
          notesElement.css('zIndex','');
          $scope.model.showControls = true;
        }else{
          currentColor = event.target.getAttribute('sws-color');
          areaPointer.style.border = 'solid '+currentColor+' 5px';
        }
        console.log(event);
      }


      $scope.rpClick = function(){

        if (!areaPointer){
          notesElement = iElement.find('#notes');

          areaPointer = document.createElement('DIV');
          areaPointer.style.position = 'absolute';
          areaPointer.style.width = previewElement.width()+'px';
          areaPointer.style.height = previewElement.height()+'px';
          areaPointer.style.top = previewElement.position().top+'px';
          areaPointer.style.left = previewElement.position().left+'px';
          areaPointer.style['margin'] = previewElement.css('margin');
          areaPointer.style['background-color'] = 'rgba(0,0,0,0)';
          //areaPointer.style.border = 'solid red 5px';

          iElement.find('#main-content')[0].appendChild(areaPointer);

          // We add color div to change the color of pointer
          function addBox(id, color, icon, left){
            var size = 40;
            var boxDiv = document.createElement('DIV');
            boxDiv.setAttribute('id', 'sws-rp-box-'+id);
            boxDiv.setAttribute('sws-color', color);
            boxDiv.style.position = 'absolute';
            boxDiv.style.width = size+'px';
            boxDiv.style.height = size+'px';
            boxDiv.style.top = '-'+(size+20)+'px';
            boxDiv.style.left = left;
            boxDiv.style['text-align'] = 'center';
            boxDiv.style['font-size'] = '25px';
            boxDiv.style['line-height'] = size+'px';
            if (icon){              
              boxDiv.style['background-color'] = '#7F89A5';
              boxDiv.classList.add('fa');
              boxDiv.classList.add(icon);
              boxDiv.style.color = 'white';
            }else{
              boxDiv.style[Modernizr.prefixed('boxShadow')] = '0px 0px 10px 0 black';
              boxDiv.style['border-radius'] = size+'px';
              boxDiv.style.border = 'solid 1px white';
              boxDiv.style['background-color'] = color;
            }
            return boxDiv;
          }

          //fa-circle
          areaPointer.appendChild(addBox('red', '#FF0000', null,'0'));
          areaPointer.appendChild(addBox('white', '#FFFFFF', null,'20%'));
          areaPointer.appendChild(addBox('black', '#000000', null,'40%'));
          areaPointer.appendChild(addBox('blue', '#005FFF', null,'60%'));
          areaPointer.appendChild(addBox('close', 'black', 'fa-times','calc(100% - 30px)'));

          iElement.find('#sws-rp-box-red').bind('click', boxClicked);
          iElement.find('#sws-rp-box-white').bind('click', boxClicked);
          iElement.find('#sws-rp-box-black').bind('click', boxClicked);
          iElement.find('#sws-rp-box-blue').bind('click', boxClicked);
          iElement.find('#sws-rp-box-close').bind('click', boxClicked);
        }
        
        $scope.model.showControls = false;
        areaPointer.style.display = '';
        notesElement.css('top', (notesElement.position().top - 70)+'px');
        notesElement.css('zIndex',-100);
        

        $(areaPointer).hammer().off('drag', touchFeedback);
        $(areaPointer).hammer().on('drag', touchFeedback);

      }
    }
  };
  return directiveDefinitionObject;
}]);