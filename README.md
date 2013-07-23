revealjs-sockets-notes
======================

Reveal Sockets plugin for speakers that offer a better interaction with the slides.


# Before installation

This interface use the websocket to control your presentation and to communicate with it. It use socket.io as websocket server and connect as webserver. So you have to install node.js on the computer that will run the presentation.

# Install

To use it you have to do severals things

1. Copy this directory into : 'YourRevealPresentation/plugin/socket-notes'
2. Install the node modules in the server (YourRevealPresentation/plugin/socket-notes/server) directory with : npm install
3. Start the server from your revealPresentation folder root with "node plugin/socket-notes/server/server.js"
4. Launch your favorites browser and go to http://localhost:8080
5. Select the right network and click on it
6. Scan the QrCode with your smartphone