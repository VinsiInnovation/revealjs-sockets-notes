Developper Guide
======================

You have to follow this guide if you want to contribute or to use the developpement version


# Require for installation

This plugin use : 

 * NodeJS
 

1. For NodeJS you have to install [node.js](http://nodejs.org/download/). Don't forget to select to add node to the path ! 

**It is important that you have the right to write on the directory where the reveal presentation is, because the server will write some files on your File System.**

## Require for build

The build is based on those tools

 * Grunt
 * Bower (and implicitly git)

1. For Grunt : just execute ```npm install -g grunt-cli``` 
2. For bower : just execute ```npm install -g bower```

If you are behind a proxy, you have to configure npm to go throught proxy [npm behind proxy](http://jjasonclark.com/how-to-setup-node-behind-web-proxy) and for bower, you have to set HTTP\_PROXY and HTTPS\_PROXY as env var and you might have to specify to use https over git protocol : [https://coderwall.com/p/sitezg/](https://coderwall.com/p/sitezg/)

## Install

1. Download or clone the repository (on branch [dev](https://github.com/VinsiInnovation/revealjs-sockets-notes/tree/dev))
2. Copy this directory into : 'YourRevealPresentation/plugin/sockets-notes'

## Build, the project

A build.bat or build.sh was write to build the project to a dist directory. build-dev.bat and build-dev.sh are the script you have to start for initialize your project.

1. Go to 'YourRevealPresentation/plugin/sockets-notes'
2. run 'build-dev.bat' or 'build-dev.sh'

This should normally download all the necessary dependancies


### In the presentation


Add the SocketIO dependency in your html

```html
<script src="/socket.io/socket.io.js"></script>
```

Check that head.js library is add

```html
<script src="{REVEALJS_PATH}/lib/js/head.min.js"></script>
```


You have to add thoses lines in your html (in the revealJS Dependancies)


```javascript

			// Full list of configuration options available here:
			// https://github.com/hakimel/reveal.js#configuration
			Reveal.initialize({
				controls: true,
				progress: true,
				history: true,
				center: true,

				theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
				transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/fade/none

				// Parallax scrolling
				// parallaxBackgroundImage: 'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg',
				// parallaxBackgroundSize: '2100px 900px',

				// Optional libraries used to extend on reveal.js
				dependencies: [
					{ src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
					{ src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
					{ src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
					{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
					{ src: 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
					{ src: 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } },
                    ...YOUR CODE HERE...
				]
			});

```

Add the main dependency

```javascript
{ src: '{$REVEAL_HOME_DIRECTORY}/plugin/sockets-notes/reveal_plugin/src/js/notes-client.js', async: true, callback: function() { RevealClientNotes.init({}); } }
```

The object to pass to 'init' method has thoses parameters

```javascript
    {
        controlsColor : 'htmlColorCode' // Default value is 'white'
    }
```

Check that the markdown reveal plugin is active

```javascript
{ src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } }
```

According to the number of plugins you want to use with the remote control, add as many lines as you want in the reveal dependancies : 

```javascript
{ src: '{$REVEAL\_HOME\_DIRECTORY}/plugin/sockets-notes/reveal_plugin/src/plugins/*{thePluginYouWant}*.js', async: true}
```


### Use it

Start the server from your revealPresentation folder root with ```node plugin/sockets-notes/dist/server/server.js -r REVEAL_DIRECTORY_PATH``` (The REVEAL\_DIRECTORY\_PATH is corresponding to the relative path according to the curent directory where the reveal presentation with the plugin is present (A directory where plugin/sockets-notes is present)). If your reveal presentation is on the root of the server (I.E. the plugin directory is aside of the index.html) juste start the server with ```node plugin/sockets-notes/server/src/server.js -d true```

```Bash
node plugin/sockets-notes/server/server.js -d true -r REVEAL_DIRECTORY_PATH
```


* Launch your reveal presentation on http://localhost:8080/{youRevealPresentation}.html
* Tap on your keyboard CRTL+Q
* Select the right network and click on it
* Scan the QrCode with your smartphone
* Enjoy ! 


**You could user node ```{PATH_TO_SERVER_JS}/server.js -h``` for getting the available commands**

### Use the development version

If you want to work with the source, you will have to install [Compass](http://compass-style.org/install/). And you have to install the sourcemaps for compass : ```gem install compass-sourcemaps --pre``` and ```gem install compass --pre```

The build task use previously don't use compass, so if you want to build a part of the project, you have to run ```grunt release``` instead of ```grunt release_build``` (cf [https://github.com/chriseppstein/compass/issues/1108](https://github.com/chriseppstein/compass/issues/1108))

When you will work with the server, don't forget to specify that your are in development mode : ```node plugin/sockets-notes/server/src/server.js -d true```


# How To contribute ?


More info soon...