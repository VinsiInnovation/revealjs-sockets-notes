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
			
			// Parent div for managing the perspective
			parentDiv = document.createElement('DIV');
			parentDiv.style.position = 'absolute';
			parentDiv.style.left = '0';
			parentDiv.style.top = '0';
			parentDiv.style.width = '100%';
			parentDiv.style.height = '100%';
			parentDiv.style['-webkit-perspective'] = '1000';			
			parentDiv.style['-moz-perspective'] = '1000';			
			parentDiv.style['-o-perspective'] = '1000';			
			parentDiv.style['-ms-perspective'] = '1000';			
			parentDiv.style['perspective'] = '1000';			
			parentDiv.style['z-index'] = '200';


			// Plan div for orienting the pointer
			pointerDiv = document.createElement('DIV');
			pointerDiv.style.position = 'absolute';
			pointerDiv.style.width = size+'px';
			pointerDiv.style.height = size+'px';
			pointerDiv.style.left = '50%';
			pointerDiv.style.top = '100%';
			pointerDiv.style['margin-left'] = '-'+(size / 2)+'px';
			pointerDiv.style['background-color'] = 'transparent';			
			pointerDiv.style['-webkit-transform-style'] = 'preserve-3d';
			pointerDiv.style['-moz-transform-style'] = 'preserve-3d';
			pointerDiv.style['-o-transform-style'] = 'preserve-3d';
			pointerDiv.style['-ms-transform-style'] = 'preserve-3d';
			pointerDiv.style['transform-style'] = 'preserve-3d';

			// The pointer symbolise by a delta on Y
			pointerDivShadow = document.createElement('DIV');
			pointerDivShadow.style.position = 'absolute';
			pointerDivShadow.style.width = sizeS+'px';
			pointerDivShadow.style.height =sizeS+'px';
			pointerDivShadow.style.left = '0';
			pointerDivShadow.style.top = '0';
			pointerDivShadow.style['background-color'] = 'white';			
			pointerDivShadow.style['border-radius'] = sizeS+'px';			
			pointerDivShadow.style['-webkit-transform-style'] = 'preserve-3d';
			pointerDivShadow.style['-moz-transform-style'] = 'preserve-3d';
			pointerDivShadow.style['-o-transform-style'] = 'preserve-3d';
			pointerDivShadow.style['-ms-transform-style'] = 'preserve-3d';
			pointerDivShadow.style['transform-style'] = 'preserve-3d';

			parentDiv.appendChild(pointerDiv);
			pointerDiv.appendChild(pointerDivShadow);
			document.body.appendChild(parentDiv);
		}

		if (positionObject.hide){
			pointerDiv.style.display = 'none';			
			pointerDivShadow.style.display = 'none';			
		}else{

			// We rotate the plan div according to the orientation of the phone
			pointerDiv.style.display = '';			
			pointerDiv.style['-webkit-transform'] = 'rotateZ('+ -positionObject.alpha +'deg) rotateY('+ (positionObject.gamma) +'deg) rotateX('+ (positionObject.beta*-1)+'deg)';
			pointerDiv.style['-moz-transform'] = 'rotateZ('+ -positionObject.alpha +'deg) rotateY('+ (positionObject.gamma) +'deg) rotateX('+ (positionObject.beta*-1)+'deg)';
			pointerDiv.style['-o-transform'] = 'rotateZ('+ -positionObject.alpha +'deg) rotateY('+ (positionObject.gamma) +'deg) rotateX('+ (positionObject.beta*-1)+'deg)';
			pointerDiv.style['-ms-transform'] = 'rotateZ('+ -positionObject.alpha +'deg) rotateY('+ (positionObject.gamma) +'deg) rotateX('+ (positionObject.beta*-1)+'deg)';
			pointerDiv.style['transform'] = 'rotateZ('+ -positionObject.alpha +'deg) rotateY('+ (positionObject.gamma) +'deg) rotateX('+ (positionObject.beta*-1)+'deg)';
			
			// the reverse the rotation of the plan in order to display a circle in front of the screen
			pointerDivShadow.style.display = '';			
			pointerDivShadow.style['-webkit-transform'] = 'translateY(-1500px) translateX('+((size - sizeS) / 2)+'px) rotateZ('+ positionObject.alpha +'deg) rotateY('+ -positionObject.gamma +'deg) rotateX('+ (-positionObject.beta*-1)+'deg) translateZ(-100px)';
			pointerDivShadow.style['-moz-transform'] = 'translateY(-1500px) translateX('+((size - sizeS) / 2)+'px) rotateZ('+ positionObject.alpha +'deg) rotateY('+ -positionObject.gamma +'deg) rotateX('+ (-positionObject.beta*-1)+'deg) translateZ(-100px)';
			pointerDivShadow.style['-o-transform'] = 'translateY(-1500px) translateX('+((size - sizeS) / 2)+'px) rotateZ('+ positionObject.alpha +'deg) rotateY('+ -positionObject.gamma +'deg) rotateX('+ (-positionObject.beta*-1)+'deg) translateZ(-100px)';
			pointerDivShadow.style['-ms-transform'] = 'translateY(-1500px) translateX('+((size - sizeS) / 2)+'px) rotateZ('+ positionObject.alpha +'deg) rotateY('+ -positionObject.gamma +'deg) rotateX('+ (-positionObject.beta*-1)+'deg) translateZ(-100px)';
			pointerDivShadow.style['transform'] = 'translateY(-1500px) translateX('+((size - sizeS) / 2)+'px) rotateZ('+ positionObject.alpha +'deg) rotateY('+ -positionObject.gamma +'deg) rotateX('+ (-positionObject.beta*-1)+'deg) translateZ(-100px)';
			pointerDivShadow.style['background-color'] = positionObject.color;
		}	
		
	}

	RevealClientNotes.registerPlugin('sp', callBack);

	return{

	};

})();

