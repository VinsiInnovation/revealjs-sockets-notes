/*
* Remote pointer plugin
*/
plugins.directive('spPlugin', ['$rootScope'
  ,function ($rootScope) {
   var directiveDefinitionObject = {
    restrict: 'A',
    priority : 103,
    scope: false,    
    link: function postLink($scope, iElement, iAttrs) { 

      $scope.register({
        name : 'sensor pointer',
        icon : 'fa-compass',
        id : 'sp'
      });

      // y = 0 xLeft =  315 xCenter = 280 xRight =  245
      // y = 50 xLeft =  320 xCenter = 255 xRight =  215

      var previewElement = iElement.find('#preview');
      var areaPointer = null;
      var currentColor = 'red';
      var initialX = -1;
      var initialY = -1;
      var initialYPercent = -1;
      var maxY = 50;
      var deltaX = 40;
      var deltaY = 30;

      function motionFeedback(event){
        var x = event.accelerationIncludingGravity.x; //inclinaison of phone (right / left)
        var y = event.accelerationIncludingGravity.y; // inclinaison of phone (top / bottom)
        var z = event.accelerationIncludingGravity.z; 

        x = (x < 0 ? Math.max(-3, x) : Math.min(3,x)) +3;
        y = Math.max(0, Math.min(7, y));

        if (initialX === -1 || Math.abs(initialX - x) < 10){
          initialX = x;
        }

        // We have to inverse due to acceleration negativ
        var percentX = 100 - Math.round((initialX / 6) * 100);
        var percentY = 100 - Math.round((y / 7) * 100);

        $scope.pluginCommunication('sp', {
            hide : false,
            x : percentX,
            y : percentY,
            color : currentColor
        });


      }

       function orientationFeedback(event){
        // We don't allow the pointer if the smartphone is directed to the bottom
        if (
          (initialX === -1 || !initialX) 
          && (event.beta < 0 || event.beta > maxY)
            ){
          return;
        }

        if (initialX === -1 || !initialX){
          initialX = event.alpha;
          initialY = event.beta;
          // We calculate the position of smartphone use as reference in Y;
          initialY = Math.max(0, Math.min(maxY, initialY));
          initialYPercent = 100 - Math.round((initialY / maxY) * 100);
          initialYPercent = initialYPercent === 0 ? 1 : initialYPercent;
        }
        var y = event.beta; // inclinaison of phone (top / bottom)        

        //x = (x < 0 ? Math.max(-3, x) : Math.min(3,x)) +3;
        y = Math.max(0, Math.min(maxY, y));   
        // We calculate the percent of Y to evaluate the X
        var percentY = 100 - Math.round((y / maxY) * 100);

        var xRef = (initialX * percentY) / initialYPercent;
        var x = xRef - event.alpha; //inclinaison of phone (right / left)
        var maxX = 20; //10 + ((25 - 10) * (y / maxY));
    
        x = (x < 0 ? Math.max(-maxX, x) : Math.min(maxX,x)) +maxX;
        var percentX = Math.round((x / (maxX*2)) * 100);

        $scope.pluginCommunication('sp', {
            hide : false,
            x : Math.round(percentX),
            y : Math.round(percentY),
            color : currentColor
        });



      }

      function boxClicked(event){
        if (event.target.id === 'sws-sp-box-close'){
          window.removeEventListener('deviceorientation', orientationFeedback, false);
          areaPointer.style.display = 'none';
        }else{
          currentColor = event.target.getAttribute('sws-color');
          areaPointer.style.border = 'solid '+currentColor+' 5px';
        }
        console.log(event);
      }


      $scope.spClick = function(){
        if (!window.DeviceOrientationEvent){
          alert('Device Motion not available');
          return;
        }

        if (!areaPointer){
          areaPointer = document.createElement('DIV');
          areaPointer.style.position = 'absolute';
          areaPointer.style.width = previewElement.width()+'px';
          areaPointer.style.height = previewElement.height()+'px';
          areaPointer.style.top = previewElement.position().top+'px';
          areaPointer.style.left = previewElement.position().left+'px';
          areaPointer.style['margin'] = previewElement.css('margin');
          areaPointer.style['background-color'] = 'rgba(0,0,0,0)';
          areaPointer.style.border = 'solid red 5px';

          iElement.find('#main-content')[0].appendChild(areaPointer);

          // We add color div to change the color of pointer
          function addBox(id, color, icon, left){
            var boxDiv = document.createElement('DIV');
            boxDiv.setAttribute('id', 'sws-sp-box-'+id);
            boxDiv.setAttribute('sws-color', color);
            boxDiv.style.position = 'absolute';
            boxDiv.style.width = '40px';
            boxDiv.style.height = '40px';
            boxDiv.style.top = '-45px';
            boxDiv.style.left = left;
            boxDiv.style.color = color;
            boxDiv.style['text-align'] = 'center';
            boxDiv.style['font-size'] = '30px';
            boxDiv.style['line-height'] = '40px';
            boxDiv.style['background-color'] = 'lightgray';
            boxDiv.style[Modernizr.prefixed('boxShadow')] = '1px 1px 2px 0 #656565';
            boxDiv.classList.add('fa');
            boxDiv.classList.add(icon);
            return boxDiv;
          }

          areaPointer.appendChild(addBox('red', 'red', 'fa-circle','0'));
          areaPointer.appendChild(addBox('white', 'white', 'fa-circle','50px'));
          areaPointer.appendChild(addBox('black', 'black', 'fa-circle','100px'));
          areaPointer.appendChild(addBox('blue', 'blue', 'fa-circle','150px'));
          areaPointer.appendChild(addBox('close', 'black', 'fa-times','calc(100% - 50px)'));

          iElement.find('#sws-sp-box-red').bind('click', boxClicked);
          iElement.find('#sws-sp-box-white').bind('click', boxClicked);
          iElement.find('#sws-sp-box-black').bind('click', boxClicked);
          iElement.find('#sws-sp-box-blue').bind('click', boxClicked);
          iElement.find('#sws-sp-box-close').bind('click', boxClicked);
        }
        
        areaPointer.style.display = '';
        
        initialX = -1;
        window.removeEventListener('deviceorientation', orientationFeedback, false);
        window.addEventListener('deviceorientation', orientationFeedback, false);

      }
    }
  };
  return directiveDefinitionObject;
}]);