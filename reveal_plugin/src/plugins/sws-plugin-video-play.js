/*
* Audio Play plugin
*/
function callBack(object){
	var video = document.querySelector("section.present:not(.stack) video");
	if (video){
		if (object.action === 'play-pause'){			
			if (video.paused){
				video.play();				
			}else{
				video.pause();
			}
		}else if (object.action === 'skip'){
			
		}
	}
}

RevealClientNotes.registerPlugin('vp', callBack);