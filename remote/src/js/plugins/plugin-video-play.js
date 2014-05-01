/*
* Video Play plugin
*/
'use strict';

plugins.directive('vpPlugin', [
  function () {
   var directiveDefinitionObject = {
    restrict: 'A',
    require: '^sws',
    priority : 100,
    scope: false,    
    link: function postLink(scope, iElement, iAttrs, swsControl) { 

      scope.register({
        name : 'play video',
        icon : 'fa-youtube-play',
        id : 'vp'
      });

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

      var init = false;
      scope.vpClose = function(){
        swsControl.restoreSlideState();
      }

      scope.vpClick = function(){
        if (!init){

          scope.ui.excludeArray.push('sws-vp-range-time');

          init = true;
          
          // The size of an element
          var size = 40;      

          var ctrlArea = document.querySelector('#sws-plugin-ctrl-vp .sws-plugin-ctrl');
          var divDescription = document.createElement('DIV');
          divDescription.classList.add('sws-plugin-vp-desc');         
          divDescription.innerHTML = '<ol>'+
              '<li>Mute/Unmute the video</li>'+
              '<li>Play/Pause the video</li>'+
              '<li>Move in the video</li>'+
              '</ol>';
          ctrlArea.appendChild(divDescription);
          ctrlArea.appendChild(addBox('mute', '#FF0000', 'fa-volume-off', '10px'));
          ctrlArea.appendChild(addBox('play', '#FF0000', 'fa-play',(size+15)+'px'));
          ctrlArea.appendChild(addRange('time',((2*size)+25)+'px'));

          iElement.find('#sws-vp-box-play').bind('click', function(event){
            angular.element(event.target).toggleClass('fa-play');
            angular.element(event.target).toggleClass('fa-pause');
            scope.pluginCommunication('vp', {action:'play-pause'});  
          });

          iElement.find('#sws-vp-box-mute').bind('click', function(event){
            angular.element(event.target).toggleClass('fa-volume-off');
            angular.element(event.target).toggleClass('fa-volume-up');
            scope.pluginCommunication('vp', {action:'mute-volume'});  
          });

           iElement.find('#sws-vp-range-time').bind('change', function(event){
            console.log(event.target.value);
            scope.pluginCommunication('vp', {action:'skip', time : event.target.value});  
          });
        }
        

        swsControl.syncToDist();
        scope.ui.showControls = false;
        scope.ui.showPlugin = true;
        scope.pluginCommunication('vp', {});
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

       pluginStyleSheet.insertRule('.sws-plugin-vp-desc {'+
        'padding : 10px;'+
        'overflow : auto;'+
        'font-size : 1.2em;'+
        'height : calc(100% - '+size+'px - 15px);'+
        'height : -webkit-calc(100% - '+size+'px - 15px);'+        
      '}',0);

      pluginStyleSheet.insertRule('.sws-plugin-vp-box{'+
        'bottom : 20px;'+
        'top : initial'+
      '}',0);

      pluginStyleSheet.insertRule('.sws-plugin-vp-range:before, .sws-plugin-vp-range:after {'+
        'position : absolute; '+
        'font-size : 10px;'+
        'bottom : 0.3em;'+
        'color : #aaa;'+
      '}',0);

      pluginStyleSheet.insertRule('.sws-plugin-vp-range:before{'+
        'content : attr(min); '+
        'left : 0em; '+
      '}',0);

      pluginStyleSheet.insertRule('.sws-plugin-vp-range:after {'+
        'content : attr(max); '+
        'right : 0em; '+
      '}',0);

      pluginStyleSheet.insertRule('.sws-plugin-vp-range{'+
        '-webkit-appearance: none;'+
        'background-color: black;'+
        'bottom : 30px;'+
        'top : initial;'+
        'height: 2px;'+
      '}',0);

      pluginStyleSheet.insertRule('.sws-plugin-vp-range::-webkit-slider-thumb{'+
        '-webkit-appearance: none;'+
        'position: relative;'+
        'top: -1px;'+
        'z-index: 1;'+
        'width: 11px;'+
        'height: 11px;'+
 
        '-webkit-border-radius: 40px;'+
        '-moz-border-radius: 40px;'+
        'border-radius: 40px;'+
        'background-color: #666;'+
      '}',0);
      
    }
  };
  return directiveDefinitionObject;
}]);