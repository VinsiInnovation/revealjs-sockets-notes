/*
* Remote Pointer plugin
*
* Will show a pointer on reveal presentation corresponding to move of finger on mobile 
*/
SWSRemotePointer = (function(){

	var pointerDiv = null;

	function callBack(positionObject){
		if (!pointerDiv){
			pointerDiv = document.createElement('DIV');
			pointerDiv.style.position = 'absolute';
			pointerDiv.style.width = '10px';
			pointerDiv.style.height = '10px';
			pointerDiv.style['border-radius'] = '10px';			
			pointerDiv.style['z-index'] = '200';

			//var revealDiv = document.querySelector('.reveal');
			document.body.appendChild(pointerDiv);
		}

		if (positionObject.hide){
			pointerDiv.style.display = 'none';			
		}else{
			pointerDiv.style.display = '';			
			pointerDiv.style.top = positionObject.y+'%';
			pointerDiv.style.left = positionObject.x+'%';
			pointerDiv.style['background-color'] = positionObject.color;
		}	
		
	}

	RevealClientNotes.registerPlugin('rp', callBack);

	return{

	};

})();

