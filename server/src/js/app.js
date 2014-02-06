$(function(){
    App.initConf();
});


var App = (function (){
    
    var conf = null;
    
    var initConf = function(){
         // Read configuration file for getting server port
        $.getJSON('../conf/conf.json', function(data){                  
            conf = data;
            init();
        })
        .error(function(e){
            console.log("Error when trying to load config file : "+e);
        })
        ;
    };
    
    var init = function(){
        $.getJSON('ips.json', function(data) {

            var qrCode = new QRCode("qrCode", {
                text: "",
                width: 256,
                height: 256,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
            var list = "<ul>";
            var datas = data;
            for (var i = 0; i < data.length; i++){
                list+= "<li><a href='#' id='"+data[i].id+"'>"+data[i].name+"</a></li>";                
            }
            list += "</ul>";
            $('#listIp').html(list);
            
             for (var i = 0; i < data.length; i++){
                $('#'+data[i].id).on('click',function(event){
                    qrCode.clear();
                    qrCode.makeCode("http://"+datas[event.target.id].ip+":"+conf.port+window.location.pathname+(conf.devMode ?"../../" : "../")+"remote/notes-speaker.html");
                    $("#qrCodeLink").attr("href","http://"+datas[event.target.id].ip+":"+conf.port+window.location.pathname+(conf.devMode ?"../../" : "../")+"remote/notes-speaker.html");
                });
            }
        
        })
        .error(function() { 
            // TODO 
        });
        
        var alreadyInit = false;
        
       
        var socket = io.connect('http://'+window.location.hostname+':'+conf.port);
        socket.on("message", function(json){
            if (json.type === "ping"){			
                var url = "http://"+window.location.hostname+":"+conf.port+"/index.html";
                if (!alreadyInit){                    
                    window.open(url,'_blank');
                }
                alreadyInit = true;
            }
        });
        
    };

    return {
        initConf : initConf
    }
})();