
// Server part
var connect = require('connect');
var app = connect.createServer(
    connect.static(__dirname)
).listen(8080);

// Define socket part
var io   = require('socket.io');
var wsServer = io.listen(app);
wsServer.sockets.on('connection', function(socket) {
    console.log('### connection');
    socket.on('message', function(message) {
        console.log('### message: '+message);
        socket.broadcast.emit('message', message);
    });    
});

// Service for rendering adresses
var os = require('os');
var fs = require('fs');
var ifaces=os.networkInterfaces();
var jsonNetWork = [];
for (var dev in ifaces) {
  var alias=0;
  ifaces[dev].forEach(function(details){
    if (details.family=='IPv4') {
        jsonNetWork.push({
            name:dev,
            ip : details.address
        });
      console.log(dev+(alias?':'+alias:''),details.address);
      ++alias;
    }
  });
}
fs.writeFile("./ips.json", JSON.stringify(jsonNetWork), function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 