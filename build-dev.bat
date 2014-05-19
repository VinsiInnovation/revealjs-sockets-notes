echo "Start Remote build"
cd remote 
call npm install 
call bower install
echo "Remote build done"
echo ""
echo "Start Reveal build"
cd ../reveal_plugin 
call npm install 
echo "Reveal build done"
echo ""
echo "Start Server build"
cd ../server 
call npm install 
cd src
call npm install
call bower install
echo "Server build done"
cd ../..