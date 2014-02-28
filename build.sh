#!/bin/bash
echo "Start Remote build"
cd remote
npm install
bower install
grunt release_build
echo "Remote build done"
echo ""
echo "Start Reveal build"
cd ../reveal_plugin
npm install
grunt release_build
echo "Reveal build done"
echo ""
echo "Start Server build"
cd ../server
npm install
bower install
grunt release
echo "Server build done"
echo ""
cd ../dist/server
echo "Load node modules for the server"
npm install 
cd ../..
