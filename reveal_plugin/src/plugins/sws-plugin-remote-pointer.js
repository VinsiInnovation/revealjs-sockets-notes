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
			pointerDiv.style.width = '20px';
			pointerDiv.style.height = '20px';
			pointerDiv.style['border-radius'] = '20px';
			pointerDiv.style['background-color'] = 'red';

			var revealDiv = document.querySelector('.reveal');
			revealDiv.appendChild(pointerDiv);
		}

		if (positionObject.hide){
			pointerDiv.style.display = 'none';			
		}else{
			pointerDiv.style.top = positionObject.x+'%';
			pointerDiv.style.left = positionObject.y+'%';
		}	
		
	}

	RevealClientNotes.registerPlugin('rp', callBack);

	return{

	};

})();

