#!/bin/bash
echo "Start Remote build"
cd remote
npm install
bower install
echo "Remote build done"
echo ""
echo "Start Reveal build"
cd ../reveal_plugin
npm install
echo "Reveal build done"
echo ""
echo "Start Server build"
cd ../server
npm install
cd src
npm install
echo "Server build done"
echo ""
cd ../..