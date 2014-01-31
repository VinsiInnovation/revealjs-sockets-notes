components.directive('actionBar', ['$rootScope','$injector'
  ,function ($rootScope,$injector) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/actionbar.html',
    replace: true,
    priority : 50,
    restrict: 'E',
    scope: true,    
    link: function postLink($scope, iElement, iAttrs) { 

      $scope.showList = false;

      $scope.togglePluginList = function(){
        $scope.showList = !$scope.showList;
      }

      $scope.activeFilter = function(plugin){
        return plugin.active;
      }

      $scope.pluginClicked = function(plugin){
        $scope[plugin.id + 'Click']();
      }


      $scope.fullscreen = function(){
        if (document.fullscreenElement || 
            document.webkitFullscreenElement ||
            document.mozFullscreenElement){
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }else{
            var docElm = document.getElementById("main-content");
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            }
            else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            }
            else if (docElm.webkitRequestFullscreen) {
                docElm.webkitRequestFullscreen();
            }
        }
      }
      
    }
  };
  return directiveDefinitionObject;
}]);