# About the project

**Reveal Sockets Notes** is a _[RevealJS](https://github.com/hakimel/reveal.js/)_ plugin for speakers that offer a remote control of the presentation from your mobile located in the same network loop.

The basic features ares : 

* Remote control of presentation, you could navigate throught your presentation on mobile and validate the slide to show it on your presentation screen.
* You have access to the notes of the current slide
* You could configure a timer if your presentation need to respect a timing.
* The remote provides also some plugins to enhance the speaker experiences. See after for more information about the plugins


# Getting Started

## Require for installation

This plugin use : 

 * NodeJS

1. For NodeJS you have to install [node.js](http://nodejs.org/download/). Don't forget to select to add node to the path ! 


**It is important that you have the right to write on the directory where the reveal presentation is because the start of the server will write some files on your File System.**


## Install

1. Download of clone the repository
2. Copy this directory into : 'YourRevealPresentation/plugin/sockets-notes'

## Init, the project

A init.bat or init.sh was write to help you to init the project

1. Go to 'YourRevealPresentation/plugin/sockets-notes'
2. run 'init.bat' or 'init.sh'

### In the presentation


Add the SocketIO dependency in your html

```html
<script src="/socket.io/socket.io.js"></script>
```

Add the head.js library

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
{ src: '{$REVEAL_HOME_DIRECTORY}/plugin/sockets-notes/reveal_plugin/js/notes-client.js', async: true, callback: function() { RevealClientNotes.init({}); } }
```

The object to pass to init method has thoses parameters

```javascript
    {
        controlsColor : 'htmlColorCode' // Default value is 'white'
    }
```

Check that the markdown reveal plugin active

```javascript
{ src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
```

According to the number of plugins you want to use with the remote control, add as many lines as you want somes plugins in the reveal dependancies : 

```javascript
{ src: '{$REVEAL\_HOME\_DIRECTORY}/plugin/sockets-notes/reveal_plugin/plugins/*{thePluginYouWant}*.js', async: true}
```

## Use it

Start the server from your revealPresentation folder root with the command line : 
(The REVEAL\_DIRECTORY\_PATH is corresponding to the relative path according to the curent directory where the reveal presentation with the plugin is present (A directory where plugin/sockets-notes is present)). If your reveal presentation is on the root of the server (I.E. the plugin directory is aside of the index.html) juste start the server with ```node plugin/sockets-notes/server/server.js```

```Bash
node plugin/sockets-notes/server/server.js -r REVEAL_DIRECTORY_PATH
```

* Launch your reveal presentation on http://localhost:8080/{youRevealPresentation}.html
* Tap on your keyboard CRTL+Q
* Select the right network and click on it
* Scan the QrCode with your smartphone
* Enjoy ! 


**You could user node ```{PATH_TO_SERVER_JS}/server.js -h``` for getting the available commands** (dev mode is only to use if you are on the branch dev !)

url of githupPage : http://vinsiinnovation.github.io/revealjs-sockets-notes/

# Plugins

## Plugin list

Here is the list of plugin and their paths (according to reveal\_plugins/plugins directory) : 

 * ```sws-plugin-video-play.js``` : Could play or pause a html5 video tag in the current slide show on screen
 * ```sws-plugin-audio-play.js``` : Could play or pause a html5 audio tag in the current slide show on screen
 * ```sws-plugin-remote-pointer.js``` : Allow you to use your finger as laser pointer on the client presentation.
 * ```sws-plugin-sensor-pointer.js``` : Allow you to use your phone as laser pointer on the client presentation.
 *  More to come soon
