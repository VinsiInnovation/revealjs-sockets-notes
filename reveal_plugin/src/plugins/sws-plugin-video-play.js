/*
* Audio Play plugin
*/
function callBack(object){
	var video = document.querySelector("section.present:not(.stack) video");
	if (video){
		if (video.paused){
			video.play();				
		}else{
			video.pause();
		}
	}
}

RevealClientNotes.registerPlugin('vp', callBack);