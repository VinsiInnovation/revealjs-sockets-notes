/*
* Remote pointer plugin
*/
plugins.directive('rpPlugin', ['$rootScope'
  ,function ($rootScope) {
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
      var notesElement = null;
      var areaPointer = null;
      var currentColor = 'red';
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
        if (event.target.id === 'sws-rp-box-close'){
          $(areaPointer).hammer().off('drag', touchFeedback);
          areaPointer.style.display = 'none';
          notesElement.css('top','');
          notesElement.css('zIndex','');
          $scope.model.showControls = true;
          swsControl.restoreSlideState();
          $scope.pluginCommunication('rp', {
            hide : true
          });
        }else{
          currentColor = event.target.getAttribute('sws-color');
          lastTarget.classList.remove('activ');
          event.target.classList.add('activ');
          lastTarget = event.target;
        }
        console.log(event);
      }


      $scope.rpClick = function(){

        if (!areaPointer){
          notesElement = iElement.find('#notes');

          areaPointer = document.createElement('DIV');
          areaPointer.setAttribute('id', 'sws-rp-area');
          $scope.model.excludeArray.push('sws-rp-area');
          areaPointer.style.display = 'none';
          areaPointer.style.position = 'absolute';
          areaPointer.style.width = previewElement.width()+'px';
          areaPointer.style.height = previewElement.height()+'px';
          areaPointer.style.top = previewElement.position().top+'px';
          areaPointer.style.left = previewElement.position().left+'px';
          areaPointer.style['margin'] = previewElement.css('margin');
          areaPointer.style['background-color'] = 'rgba(0,0,0,0)';

          iElement.find('#main-content')[0].appendChild(areaPointer);

          // We add color div to change the color of pointer
          function addBox(id, color, icon, left){
            
            var boxDiv = document.createElement('DIV');
            boxDiv.setAttribute('id', 'sws-rp-box-'+id);
            boxDiv.setAttribute('sws-color', color);
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
          lastTarget = addBox('red', '#FF0000', null,'0');
          lastTarget.classList.add('activ');
          areaPointer.appendChild(lastTarget);
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
        
        if (areaPointer.style.display === 'none'){
          $scope.model.showPlugin = true;
          notesElement.css('top', (notesElement.position().top - 70)+'px');
        }
        areaPointer.style.display = '';
        $scope.model.showControls = false;
        swsControl.syncToDist();
        

        $(areaPointer).hammer().off('drag dragright dragleft dragup dragdown', touchFeedback);
        $(areaPointer).hammer().on('drag dragright dragleft dragup dragdown', touchFeedback);

        /*
        **************************************
        **************************************
        * Style Sheet Management
        **************************************
        **************************************
        */
        var pluginStyleSheet = (function() {
          // Create the <style> tag
          var style = document.createElement("style");

          // Add a media (and/or media query) here if you'd like!
          style.setAttribute("media", "screen");
          style.setAttribute("id", "style-sheet-sws-remote");

          // WebKit hack :(
          style.appendChild(document.createTextNode(""));

          // Add the <style> element to the page
          document.head.appendChild(style);

          return style.sheet ? style.sheet : style.styleSheet;
        })();

        function cssProp(properties){
          return Modernizr.prefixed(properties).replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
        }

        var size = 40;      
        pluginStyleSheet.insertRule('.sws-plugin-rp-box {'+
          'position : absolute;'+
          'width : '+size+'px;'+
          'height : '+size+'px;'+
          'top : -'+(size+20)+'px;'+
          'text-align : center;'+
          'font-size : 25px;'+
          'line-height : '+size+'px;'+
        '}',0);

        pluginStyleSheet.insertRule('.sws-plugin-rp-box.fa {'+
          'background-color : #7F89A5;'+
          'color : white;'+          
        '}',0);

        pluginStyleSheet.insertRule('.sws-plugin-rp-box.color {'+
          cssProp('boxShadow')+' : 0px 0px 10px 0 black; '+
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
    }
  };
  return directiveDefinitionObject;
}]);