// Configuration part
var fs = require('fs');
// If set as parameters, we get the reveal directory path
var conf = {
    devMode : false,
    port : 8080,
    revealPath : ''
};
var argList = ['-h','--help',
    '-r', '--reveal',
    '-p', '--port',
    '-d', '--dev'
];

function manageArgs(args){
    var showHelp = false;
    var newArgs = [];
    if (args.length == 0){
        return false;
    }

    if (args[0] === '-h' || args[0] === '--help'){
        showHelp = true;
        for (var i = 1; i<args.length;i++){
            newArgs.push(args[i]);
        }
    }else if (args[0] === '-r' || args[0] === '--reveal'){
        if (args.length<2 || argList.indexOf(args[1]) != -1){
            showHelp = true;
        }
        conf.revealPath = args[1]; 
        if (conf.revealPath[0] != '/' || conf.revealPath[0] != '\\'){
            conf.revealPath = '/'+conf.revealPath;
        }
        for (var i = 2; i<args.length;i++){
            newArgs.push(args[i]);
        }
    }else if (args[0] === '-p' || args[0] === '--port'){
        if (args.length<2 || argList.indexOf(args[1]) != -1){
            showHelp = true;
        }
        conf.port = args[1]; 
        for (var i = 2; i<args.length;i++){
            newArgs.push(args[i]);
        }
    }else if (args[0] === '-d' || args[0] === '--dev'){
        if (args.length<2 || argList.indexOf(args[1]) != -1){
            showHelp = true;
        }
        conf.devMode = args[1] === 'true' || args[1] === true;
        for (var i = 2; i<args.length;i++){
            newArgs.push(args[i]);
        }
    }


    if (showHelp){
        console.log('=========Reveal Speaker Notes Server');
        console.log(' Parameters : \n');
        console.log(' * -h | --help : The command help. ');
        console.log(' * -p | --path : The path of reveal js presentation (defaut : consider that the path is the directory of presentation). ');
        console.log(' * -d | --dev : Specify if we\'re in developpement mode (the path load are different) : set true or false (default is false).');
        return true;
    }

    return manageArgs(newArgs);
}

if (process.argv.length > 2){
    var args = [];
    for (var i = 2; i < process.argv.length; i++){
        args.push(process.argv[i]);
    }
    if (manageArgs(args)){
        return;
    }
}


var confFileArray = [];
var confFileJSON = JSON.stringify(conf);
if (conf.devMode){
    confFileArray.push(__dirname+'/../conf/conf.json'); // Server
    confFileArray.push(__dirname+'/../../remote/conf/conf.json'); // Remote
    confFileArray.push(__dirname+'/../../reveal_plugin/conf/conf.json'); // Reveal Client
}else{
    confFileArray.push(__dirname+'/conf/conf.json'); // Server
    confFileArray.push(__dirname+'/../remote/conf/conf.json'); // Remote
    confFileArray.push(__dirname+'/../reveal_plugin/conf/conf.json'); // Reveal Client
}
for (var i =0; i < confFileArray.length; i++){

    var confFile = confFileArray[i];
    fs.mkdir(confFile.substring(0,confFile.indexOf('conf.json')),function(e){
        if(!e || (e && e.code === 'EEXIST')){
            //do something with contents
        } else {
            //debug
            console.log(e);
        }
    });
    fs.writeFile(confFile, confFileJSON, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log('The file '+confFile+' was saved!');
        }
        
    }); 
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
            ip : details.address, 
            revealPath : conf.revealPath
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
var request = http.get('http://api.externalip.net/ip'
    , function(res){
    res.on('data', function (data) {
        try{
            jsonNetWork.push({
                id : jsonNetWork.length,
                name : 'public ip',
                ip : ''+data, 
                revealPath : conf.revealPath
            });
            console.log('public ip found : '+data);
            
        }catch(e){
            console.log('Warn : error geting ip from internet : '+e.message);      
        }
        wait = false;
    });
});
request.on('error',function(e){
    console.log('Warn : error geting ip from internet : '+e.message);
    wait = false;
});

setTimeout(function() {
    if (wait){
        console.log('Request public ip timeout ! ');
        request.abort();
        wait = false;
    }
}, 10000);


function writeFile(){
    if (wait){
        setTimeout(writeFile,500);
    }else{
        console.log('Write ip file');
        var pathIpFile = null;
        if (conf.devMode){
            pathIpFile = __dirname+'/../../reveal_plugin/conf/ips.json'; // Reveal Client
        }else{
            pathIpFile = __dirname+'/../reveal_plugin/conf/ips.json'; // Reveal Client
        }

        fs.writeFile(pathIpFile, JSON.stringify(jsonNetWork), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('The file '+pathIpFile+' was saved!');
            }
            
            console.log('Finish server loading');
        }); 
    }
}
writeFile();