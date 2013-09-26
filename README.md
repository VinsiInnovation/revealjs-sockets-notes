revealjs-sockets-notes
======================

Reveal Sockets plugin for speakers that offer a better interaction with the slides.


# Before installation

This interface use the websocket to control your presentation and to communicate with it. It use socket.io as websocket server and connect as webserver. So you have to install node.js on the computer that will run the presentation.

# Install

To use it you have to do severals things

1. Copy this directory into : 'YourRevealPresentation/plugin/sockets-notes'
2. Install the node modules in the server (YourRevealPresentation/plugin/sockets-notes/server) directory with : npm install
3. Start the server from your revealPresentation folder root with "node plugin/sockets-notes/server/server.js REVEAL_DIRECTORY_PATH" (The REVEAL_DIRECTORY_PATH is corresponding to the relative path according to the curent directory where the reveal presentation with the plugin is present (A directory where plugin/sockets-notes is present))
4. Launch your favorites browser and go to http://localhost:8080
5. Select the right network and click on it
6. Scan the QrCode with your smartphone

# In the presentation

You have to add thoses line in your html
1. { src: 'plugin/sockets-notes/client/js/notes-client.js', async: true, condition: function() { return !!document.body.classList; } } in the dependancies of Reveal
2. <script src="/socket.io/socket.io.js"></script> in the import section of your javascripts
3. You have to check that markdown plugin is present in your presentation
4. You have to check that you have the file lib/js/head.min.js in your presentation