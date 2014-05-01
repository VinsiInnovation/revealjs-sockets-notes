/**
 * Speaker Websoket plugins
 */
'use strict';

var plugins = angular.module('sws.plugins', ['sws.components'])
.run([function(){
    
}]);


/*
* Factory that provides some helpers methods for plugins
*/
plugins.factory('HelperFactory',[function(){

	
	/*
        Document Modification and helpers
        Those methods have to be called only if a plugin 
      */

	// load an additionnal javascript
	function loadScript(url){
		var js_script = document.createElement('script');
		js_script.type = "text/javascript";
		js_script.src = url;
		js_script.async = true;
		document.getElementsByTagName('head')[0].appendChild(js_script);
	}

	// load an additionnal css
	function loadCss(url){
		var css_script = document.createElement('link');
		css_script.rel = "stylesheet";
		css_script.type = "text/css";    
		css_script.href = url;
		css_script.media = 'all';
		css_script.async = true;
		document.getElementsByTagName('head')[0].appendChild(css_script);
	}

	// Modernizr Helper for getting the right prefix
	function cssProp(properties){
	    return Modernizr.prefixed(properties).replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
	 }


	return{
		// Apis 
		loadScript : loadScript,
		loadCss : loadCss,
		cssProp : cssProp
		
	};
}]);