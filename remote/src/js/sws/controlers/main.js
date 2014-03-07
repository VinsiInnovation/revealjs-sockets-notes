sws.controller('SwsCtrl',        
    ['$rootScope', '$scope', '$http', 
    function($rootScope, $scope, $http) {


       

                
        FastClick.attach(document.body);

        $http({
        	url: '../conf/conf.json',
        	method: 'GET'
        }).success(function(data, status, headers, config){              
            $scope.model.conf = data;
            console.log('Return from http !');
            //Init the webSocket and time management
            $scope.connect();
            // Load markdown reveal js
            $.getScript('http://'+window.location.hostname+':'+data.port+data.revealPath+'/plugin/markdown/marked.js', function(){
                console.log("Script markdown loaded and executed.");
            // Here you can use anything you defined in the loaded script
            });
        }).error(function(e){
            console.log("Error during getting config file : "+e);
        });


      $scope.hidePlugin = function(){
        if ($scope.model.currentPluginActiv){            
            $scope.ui.showPluginCtrl[$scope.model.currentPluginActiv] = false;
            $scope.ui.showPlugin = false;
            $scope.ui.showControls = true;
            if ($scope[$scope.model.currentPluginActiv + 'Close']){
              $scope[$scope.model.currentPluginActiv + 'Close']();
            }
            $scope.model.currentPluginActiv = null;
            
        }
    }

                
}]);