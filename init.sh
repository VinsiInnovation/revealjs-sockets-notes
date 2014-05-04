#!/bin/bash
chmod 755 *
echo "Start Server build"
cd server
echo "Load node modules for the server"
npm install
cd ..
