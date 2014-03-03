/*
* Remote pointer plugin
*/
plugins.directive('spPlugin', ['$rootScope'
  ,function ($rootScope) {
   var directiveDefinitionObject = {
    restrict: 'A',
    require: '^sws',
    priority : 103,
    scope: false,    
    link: function postLink($scope, iElement, iAttrs, swsControl) { 

      $scope.register({
        name : 'sensor pointer',
        icon : 'fa-compass',
        id : 'sp'
      });

      // y = 0 xLeft =  315 xCenter = 280 xRight =  245
      // y = 50 xLeft =  320 xCenter = 255 xRight =  215

      // y = 0 xLeft = 99 xCenter = 70 xRight =  40
      // y = 50 xLeft =  115 xCenter = 77 xRight =  30

      // We have to adjust the limits of the remote
      var xLeftBottom = 99;
      var xLeftTop = 115;
      var xRightBottom = 40;
      var xRightTop = 30;
      var deltaXBottom = xLeftBottom - xRightBottom;
      var deltaXTop = xLeftTop - xRightTop;

      // TODO : We Have to persit on localstorage the callibration for the phone

      var previewElement = iElement.find('#preview');
      var notesElement = null;
      var areaPointer = null;
      var currentColor = 'red';
      var lastTarget = null;
      var touch = false;
      var release = false;
      var initialX = -1;
      var initialY = -1;

      function getVendorPrefix()
      {
        if('result' in arguments.callee) return arguments.callee.result;

        var regex = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/;

        var someScript = document.getElementsByTagName('script')[0];

        for(var prop in someScript.style)
        {
          if(regex.test(prop))
          {
            // test is faster than match, so it's better to perform
            // that on the lot and match only when necessary
            return arguments.callee.result = prop.match(regex)[0];
          }

        }

        // Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
        // However (prop in style) returns the correct value, so we'll have to test for
        // the precence of a specific property
        if('WebkitOpacity' in someScript.style) return arguments.callee.result = 'Webkit';
        if('KhtmlOpacity' in someScript.style) return arguments.callee.result = 'Khtml';

        return arguments.callee.result = '';
      }
      
      function touchFeedback(event){        
        touch = !touch;
        release = !touch;
      }

      function orientationFeedback(event){



        /**

          Axes Used for rotation

          z
          ^  y
          |  ^ 
          | /
          |/
          ------>x

         Event Alpha is used for rotateZ 
         Event Beta is used for rotateX
         Event Gamma is used for rotateY

          When the phone is put horizontaly alpha / beta / gamma are with 0 (if the phone is pointing to the right direction)
          http://www.html5rocks.com/en/tutorials/device/orientation/

        */


        // The screen will go in Beta from 0 to 50deg (with the phone) but we have to have a number between -90 and -40
        // The screen will go in Gamma from -55deg to 55deg (we have to manage a reference point)


        // We don't allow the pointer if the smartphone has no referenced point (when the user hold the screen)
        if (touch && (initialX === -1 || !initialX)){
          initialX = event.gamma;
        }
        if (release){
          initialX = -1;
        }
        if (initialX === -1 || !initialX){
          return;
        }

         // We calculate the position of smartphone use as reference in Y;
        var beta = -90 + event.beta;

        //var deltaXTmp = initialX - event.gamma;
        var gamma = initialX - event.gamma;

        // We let Alpha to 0 because it cause to many noise in the move of pointer
        var alpha = 0;

        // If we're working with Firefox, we have to inverse the values
        if(getVendorPrefix() === 'Moz'){
          //alpha = event.alpha;
          beta = 180 - beta;
          gamma = gamma * -1;
        }

        
        $scope.pluginCommunication('sp', {
            hide : false,
            'alpha' : alpha,
            'beta' : beta,
            'gamma' : gamma,
            color : currentColor
        });
        return;

      }

      function boxClicked(event){
        if (event.target.id === 'sws-sp-box-close'){
          window.removeEventListener('deviceorientation', orientationFeedback, false);
          areaPointer.style.display = 'none';
          notesElement.css('top','');
          notesElement.css('zIndex','');
          $scope.model.showControls = true;
          swsControl.restoreSlideState();
          $scope.pluginCommunication('sp', {
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


      $scope.spClick = function(){
        if (!window.DeviceOrientationEvent){
          alert('Device Motion not available');
          return;
        }

        if (!areaPointer){
          notesElement = iElement.find('#notes'); 

          areaPointer = document.createElement('DIV');
          areaPointer.setAttribute('id', 'sws-sp-area');
          $scope.model.excludeArray.push('sws-sp-area');
          areaPointer.style.display = 'none';
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
            var boxDiv = document.createElement('DIV');
            boxDiv.setAttribute('id', 'sws-sp-box-'+id);
            boxDiv.setAttribute('sws-color', color);
            boxDiv.classList.add('sws-plugin-sp-box');
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

          lastTarget = addBox('red', '#FF0000', null,'0');
          lastTarget.classList.add('activ');
          areaPointer.appendChild(lastTarget);
          areaPointer.appendChild(addBox('white', '#FFFFFF', null,'20%'));
          areaPointer.appendChild(addBox('black', '#000000', null,'40%'));
          areaPointer.appendChild(addBox('blue', '#005FFF', null,'60%'));
          areaPointer.appendChild(addBox('close', 'black', 'fa-times','calc(100% - 30px)'));

          iElement.find('#sws-sp-box-red').bind('click', boxClicked);
          iElement.find('#sws-sp-box-white').bind('click', boxClicked);
          iElement.find('#sws-sp-box-black').bind('click', boxClicked);
          iElement.find('#sws-sp-box-blue').bind('click', boxClicked);
          iElement.find('#sws-sp-box-close').bind('click', boxClicked);
        }
        
        if (areaPointer.style.display === 'none'){
          notesElement.css('top', (notesElement.position().top - 70)+'px');
        }
        $scope.model.showControls = false;
        areaPointer.style.display = '';
        swsControl.syncToDist();
        
        initialX = -1;
        touch = false;
        release = false;
        window.removeEventListener('deviceorientation', orientationFeedback, false);
        window.addEventListener('deviceorientation', orientationFeedback, false);
        $(areaPointer).hammer().off('touch', touchFeedback);
        $(areaPointer).hammer().on('touch', touchFeedback);

      }


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
        pluginStyleSheet.insertRule('.sws-plugin-sp-box {'+
          'position : absolute;'+
          'width : '+size+'px;'+
          'height : '+size+'px;'+
          'top : -'+(size+20)+'px;'+
          'text-align : center;'+
          'font-size : 25px;'+
          'line-height : '+size+'px;'+
        '}',0);

        pluginStyleSheet.insertRule('.sws-plugin-sp-box.fa {'+
          'background-color : #7F89A5;'+
          'color : white;'+          
        '}',0);

        pluginStyleSheet.insertRule('.sws-plugin-sp-box.color {'+
          cssProp('boxShadow')+' : 0px 0px 10px 0 black; '+
          'border-radius : '+size+'px; '+
          'border : solid 1px white; '+
        '}',0);

         pluginStyleSheet.insertRule('.sws-plugin-sp-box.color.activ::after {'+
          'content : \'\'; '+
          'position : absolute; '+
          'top : '+(size+5)+'px; '+
          'left : 5px; '+
          'width : '+(size-10)+'px; '+
          'height : 5px; '+
        '}',0);

        pluginStyleSheet.insertRule('.sws-plugin-sp-box.color.red::after, .sws-plugin-sp-box.color.red {'+
          'background-color : #FF0000; '+
        '}',0);

        pluginStyleSheet.insertRule('.sws-plugin-sp-box.color.white::after, .sws-plugin-sp-box.color.white {'+
          'background-color : #FFFFFF; '+
        '}',0);

        pluginStyleSheet.insertRule('.sws-plugin-sp-box.color.black::after, .sws-plugin-sp-box.color.black {'+
          'background-color : #000000; '+
        '}',0);

        pluginStyleSheet.insertRule('.sws-plugin-sp-box.color.blue::after, .sws-plugin-sp-box.color.blue {'+
          'background-color : #005FFF; '+
        '}',0);


    }
  };
  return directiveDefinitionObject;
}]);