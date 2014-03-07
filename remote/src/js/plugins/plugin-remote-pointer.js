/*
* Remote pointer plugin
*/
plugins.directive('rpPlugin', ['$rootScope', 'HelperFactory'
  ,function ($rootScope, helper) {
  var directiveDefinitionObject = {
    restrict: 'A',
    require: '^sws',
    priority : 102,
    scope: false,    
    link: function postLink($scope, iElement, iAttrs, swsControl) { 

      $scope.register({
        name : 'remote pointer',
        icon : 'fa-pencil',
        id : 'rp'
      });

      var previewElement = iElement.find('#preview');
      var areaPointer = null;
      var currentColor = '#FF0000';
      var lastTarget = null;
      

      function touchFeedback(event){
        if (event.gesture && event.gesture.center){
          event.gesture.preventDefault();
          // We get the position of finger on page, and we have to calculate it's position on preview area
          var x = event.gesture.center.pageX,
              y = event.gesture.center.pageY,
              rect = previewElement[0].getClientRects()[0];

          var percentX = ((x-rect.left) / rect.width) * 100;
          var percentY = ((y-rect.top) / rect.height) * 100;
          $scope.pluginCommunication('rp', {
            hide : false,
            x : Math.round(percentX),
            y : Math.round(percentY),
            color : currentColor
          });
        }
      }

      function boxClicked(event){
        currentColor = event.target.getAttribute('sws-color');
        areaPointer.style['border-color'] = currentColor;
        lastTarget.classList.remove('activ');
        event.target.classList.add('activ');
        lastTarget = event.target;
        
      }

      $scope.rpClose = function(){
        $(areaPointer).hammer().off('drag', touchFeedback);
        areaPointer.style.display = 'none';
        swsControl.restoreSlideState();
        $scope.pluginCommunication('rp', {
          hide : true
        });
      }

      $scope.rpClick = function(){

        if (!areaPointer){

          areaPointer = document.createElement('DIV');
          areaPointer.setAttribute('id', 'sws-rp-area');
          $scope.ui.excludeArray.push('sws-rp-area');
          areaPointer.style.display = 'none';
          areaPointer.style.position = 'absolute';
          areaPointer.style.width = previewElement.width()+'px';
          areaPointer.style.height = previewElement.height()+'px';
          areaPointer.style.top = previewElement.position().top+'px';
          areaPointer.style.left = previewElement.position().left+'px';
          areaPointer.style['margin'] = previewElement.css('margin');
          areaPointer.style['background-color'] = 'rgba(0,0,0,0)';
          areaPointer.style.border = 'solid red 2px';
          areaPointer.style['border-color'] = currentColor;

          iElement.find('#main-content')[0].appendChild(areaPointer);

          // We add color div to change the color of pointer
          function addBox(id, color, icon, left){
            
            var boxDiv = document.createElement('DIV');
            boxDiv.setAttribute('id', 'sws-rp-box-'+id);
            boxDiv.setAttribute('sws-color', color);
            boxDiv.classList.add('sws-plugin-box');
            boxDiv.classList.add('sws-plugin-rp-box');
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

          //fa-circle
          lastTarget = addBox('red', '#FF0000', null,'10px');
          lastTarget.classList.add('activ');
          var ctrlArea = document.getElementById('sws-plugin-ctrl-rp');
          ctrlArea.appendChild(lastTarget);
          ctrlArea.appendChild(addBox('white', '#FFFFFF', null,'25%'));
          ctrlArea.appendChild(addBox('black', '#000000', null,'50%'));
          ctrlArea.appendChild(addBox('blue', '#005FFF', null,'75%'));

          iElement.find('#sws-rp-box-red').bind('click', boxClicked);
          iElement.find('#sws-rp-box-white').bind('click', boxClicked);
          iElement.find('#sws-rp-box-black').bind('click', boxClicked);
          iElement.find('#sws-rp-box-blue').bind('click', boxClicked);
        }
        
        if (areaPointer.style.display === 'none'){
          $scope.ui.showPlugin = true;
        }
        areaPointer.style.display = '';
        $scope.ui.showControls = false;
        swsControl.syncToDist();
        

        $(areaPointer).hammer().off('drag dragright dragleft dragup dragdown', touchFeedback);
        $(areaPointer).hammer().on('drag dragright dragleft dragup dragdown', touchFeedback);

      }

      /*
      **************************************
      **************************************
      * Style Sheet Management
      **************************************
      **************************************
      */
      
      var size = 40;      
     
      var pluginStyleSheet = swsControl.createStyleSheet('rp');

      pluginStyleSheet.insertRule('.sws-plugin-rp-box.color {'+
        helper.cssProp('boxShadow')+' : 0px 0px 10px 0 black; '+
        'border-radius : '+size+'px; '+
        'border : solid 1px white; '+
      '}',0);

       pluginStyleSheet.insertRule('.sws-plugin-rp-box.color.activ::after {'+
        'content : \'\'; '+
        'position : absolute; '+
        'top : '+(size+5)+'px; '+
        'left : 5px; '+
        'width : '+(size-10)+'px; '+
        'height : 5px; '+
      '}',0);

      pluginStyleSheet.insertRule('.sws-plugin-rp-box.color.red::after, .sws-plugin-rp-box.color.red {'+
        'background-color : #FF0000; '+
      '}',0);

      pluginStyleSheet.insertRule('.sws-plugin-rp-box.color.white::after, .sws-plugin-rp-box.color.white {'+
        'background-color : #FFFFFF; '+
      '}',0);

      pluginStyleSheet.insertRule('.sws-plugin-rp-box.color.black::after, .sws-plugin-rp-box.color.black {'+
        'background-color : #000000; '+
      '}',0);

      pluginStyleSheet.insertRule('.sws-plugin-rp-box.color.blue::after, .sws-plugin-rp-box.color.blue {'+
        'background-color : #005FFF; '+
      '}',0);



      
    }
  };
  return directiveDefinitionObject;
}]);