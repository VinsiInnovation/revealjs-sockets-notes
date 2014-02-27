/*
* Remote Pointer plugin based on phone sensor
*
* Will show a pointer on reveal presentation corresponding to move of mobile 
*/
SWSRemoteSensorPointer = (function(){

	var pointerDiv = null, pointerDivShadow = null;

	function callBack(positionObject){
		var size = 600;
		var sizeS = 20;

		

		if (!pointerDiv){
			pointerDiv = document.createElement('DIV');
			pointerDiv.style.position = 'absolute';
			/*pointerDiv.style.width = '10px';
			pointerDiv.style.height = '10px';
			pointerDiv.style['border-radius'] = '10px';			
			pointerDiv.style['z-index'] = '200';*/

			parentDiv = document.createElement('DIV');
			parentDiv.style.position = 'absolute';
			parentDiv.style.left = '0';
			parentDiv.style.top = '0';
			parentDiv.style.width = '100%';
			parentDiv.style.height = '100%';
			parentDiv.style['-webkit-perspective'] = '1000';			
			parentDiv.style['z-index'] = '200';


			//pointerDiv.style.width = '100%';//size+'px';
			pointerDiv.style.width = size+'px';
			//pointerDiv.style.height = '100%';//size+'px';
			pointerDiv.style.height = size+'px';
			//pointerDiv.style.left = '0';//'50%';
			pointerDiv.style.left = '50%';
			//pointerDiv.style.top = '0';//'50%';
			pointerDiv.style.top = '50%';
			pointerDiv.style['margin-left'] = '-'+(size / 2)+'px';
			pointerDiv.style['margin-top'] = '-'+(size / 2)+'px';
			pointerDiv.style['background-color'] = 'transparent';			
			pointerDiv.style['-webkit-transform-style'] = 'preserve-3d';

			pointerDivShadow = document.createElement('DIV');
			pointerDivShadow.style.position = 'absolute';
			pointerDivShadow.style.width = sizeS+'px';
			pointerDivShadow.style.height =sizeS+'px';
			pointerDivShadow.style.left = '0';
			pointerDivShadow.style.top = '0';
			/*pointerDivShadow.style['margin-left'] = '-50px';
			pointerDivShadow.style['margin-top'] = '-50px';*/
			pointerDivShadow.style['background-color'] = 'white';			
			pointerDivShadow.style['border-radius'] = sizeS+'px';			
			pointerDivShadow.style['-webkit-transform-style'] = 'preserve-3d';

			parentDiv.appendChild(pointerDiv);
			pointerDiv.appendChild(pointerDivShadow);
			//document.body.appendChild(pointerDiv);
			document.body.appendChild(parentDiv);
		}

		if (positionObject.hide){
			pointerDiv.style.display = 'none';			
			pointerDivShadow.style.display = 'none';			
		}else{

			pointerDiv.style.display = '';			
			pointerDivShadow.style.display = '';			
			/*pointerDiv.style.top = positionObject.y+'%';
			pointerDiv.style.left = positionObject.x+'%';*/
//			pointerDiv.style['-webkit-transform'] = 'rotate('+ positionObject.gamma +'deg) rotate3d(1,0,0, '+ (positionObject.beta*-1)+'deg)';
pointerDiv.style['-webkit-transform'] = 'rotateZ('+ -positionObject.alpha +'deg) rotateY('+ (positionObject.gamma) +'deg) rotateX('+ (positionObject.beta*-1)+'deg)';
			//pointerDivShadow.style['-webkit-transform'] = 'translateY(100px) translateZ(-500px) rotate('+ -positionObject.gamma +'deg) rotate3d(1,0,0, '+ (-positionObject.beta*-1)+'deg) ';
			pointerDivShadow.style['-webkit-transform'] = 'translateY(-1000px) translateX('+((size - sizeS) / 2)+'px) rotateZ('+ positionObject.alpha +'deg) rotateY('+ -positionObject.gamma +'deg) rotateX('+ (-positionObject.beta*-1)+'deg) translateZ(-100px)';
			pointerDivShadow.style['background-color'] = positionObject.color;
		}	
		
	}

	RevealClientNotes.registerPlugin('sp', callBack);

	return{

	};

})();

