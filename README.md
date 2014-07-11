# About the project

**Reveal Sockets Notes** is a _[RevealJS](https://github.com/hakimel/reveal.js/)_ plugin that transforms your mobile into a remote control for your presentations.

The basic features are : 

* Remote control 
* Asynchroneous navigation between mobile and main screen
* Access notes of the current slide on mobile.
* Configure a timer.
* The remote provides also some plugins to enhance the speaker experience. See after for more informations about the plugins.

## Getting Started

### Require for installation

This plugin use : 

 * NodeJS

1. For NodeJS you have to install [node.js](http://nodejs.org/download/). Don't forget to select to add node to the path ! 


**It is important that you have the right to write on the directory where the reveal presentation is, because the server will write some files on your File System. _Write rights must be granted on the reveal presentation directory to left the remote control operate._**


### Install

1. Download or clone the repository.
2. Copy it into : 'YourRevealPresentation/plugin/sockets-notes'

### Init, the project

The init.bat (or init.sh) helps you init the project

1. Go to 'YourRevealPresentation/plugin/sockets-notes'
2. run 'init.bat' or 'init.sh'

### In the presentation


Add the SocketIO dependency to your html

```html
<script src="/socket.io/socket.io.js"></script>
```

Check that head.js library is added

```html
<script src="{REVEALJS_PATH}/lib/js/head.min.js"></script>
```


Add the following lines to your html file (in the revealJS Dependencies) : 


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

The object requested by the 'init' method has an optionnal parameter

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
{ src: '{$REVEAL\_HOME\_DIRECTORY}/plugin/sockets-notes/reveal_plugin/plugins/*{thePluginYouWant}*.js', async: true}
```

### Use it

Start the server from your revealPresentation folder root with the command line : 
(The REVEAL\_DIRECTORY\_PATH is the relative path from the curent directory to the reveal presentation directory (A directory where plugin/sockets-notes is present)). If your reveal presentation is on the root of the server (I.E. the plugin directory is aside the index.html) just start the server with ```node plugin/sockets-notes/server/server.js```

```Bash
node plugin/sockets-notes/server/server.js -r REVEAL_DIRECTORY_PATH
```

* Launch your reveal presentation on http://localhost:8080/{youRevealPresentation}.html
* Tap on your keyboard CRTL+Q
* Select the right network and click on it
* Scan the QrCode with your smartphone
* Enjoy ! 


**You could use node ```{PATH_TO_SERVER_JS}/server.js -h``` for getting the available commands** (dev mode is only to be used if you are on the dev branch !)


## Plugins

### Plugin list

Here is the list of plugin and their paths (according to reveal\_plugins/plugins directory) : 

 * ```sws-plugin-video-play.js``` : Could play or pause a html5 video tag in the current slide show on screen
 * ```sws-plugin-audio-play.js``` : Could play or pause a html5 audio tag in the current slide show on screen
 * ```sws-plugin-remote-pointer.js``` : Allow you to use your finger as laser pointer on the client presentation.
 * ```sws-plugin-sensor-pointer.js``` : Allow you to use your phone as laser pointer on the client presentation.
 *  More to come soon
 

# Credits 

The app was developped by [jefBinomed](https://github.com/jefBinomed) and the design was imagine by [@brongier](https://twitter.com/brongier) and [@cboure](https://twitter.com/cboure)