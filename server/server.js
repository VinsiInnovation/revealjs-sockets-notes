// Configuration part
var fs = require('fs');
// If set as parameters, we get the reveal directory path
var revealPath = process.argv.length > 2 ? '/'+process.argv[2] : '';
var confFile = process.cwd()+'/plugin/sockets-notes/conf/conf.json';
var conf = null;
try{    
    conf = JSON.parse(fs.readFileSync(confFile));
}catch(err){
    console.log('Error reading confFile : '+err);
    return;
}

if (!conf){
    console.log('No configuration file found');
    return;
}

// Server part
var connect = require('connect');
    console.log(__dirname);
console.log(process.cwd());
var app = connect.createServer(
    connect.static(process.cwd())
).listen(conf.port);
console.log('Start server on port : '+conf.port);

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
var ifaces=os.networkInterfaces();
var jsonNetWork = [];
var index = 0;
for (var dev in ifaces) {
  var alias=0;
  ifaces[dev].forEach(function(details){
    if (details.family=='IPv4') {
        jsonNetWork.push({
            id: index,
            name:dev,
            ip : details.address
        });
      console.log(dev+(alias?':'+alias:''),details.address);
      index++;
      ++alias;
    }
  });
}
var http = require('http');
var wait = true;
console.log('Check Public ip');
http.get('http://api.externalip.net/ip'
    , function(res){
    res.on('data', function (data) {
        try{
            jsonNetWork.push({
                id : jsonNetWork.length,
                name : 'public ip',
                ip : ''+data
            });
            console.log('public ip found : '+data);
            
        }catch(e){
            console.log('Warn : error geting ip from internet : '+e.message);      
        }
        wait = false;
    });
}).on('error',function(e){
    console.log('Warn : error geting ip from internet : '+e.message);
    wait = false;
});


function writeFile(){
    if (wait){
        setTimeout(writeFile,500);
    }else{
        console.log('Write ip file');
        fs.writeFile('.'+revealPath+'/plugin/sockets-notes/server/ips.json', JSON.stringify(jsonNetWork), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('The file was saved!');
            }
            
            console.log('Finish server loading');
        }); 
    }
}
writeFile();