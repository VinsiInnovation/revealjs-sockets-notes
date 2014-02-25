components.directive('slidingMenu', ['$rootScope','$injector'
  ,function ($rootScope,$injector) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/slidingmenu.html',
    replace: true,
    priority : 903,
    restrict: 'E',
    scope: true,    
    link: function postLink($scope, iElement, iAttrs) { 

      
      $scope.activeFilter = function(plugin){
        return plugin.active;
      }

      $scope.pluginClicked = function(plugin){
        $scope[plugin.id + 'Click']();
        $scope.model.showMenuClass = 'collapse';
      }

      $scope.stop = function(){
        $rootScope.$broadcast('resetTimer');  
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
            //var docElm = document.body;// document.getElementById("main-content");
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

      // We add a managment of gesture in order to control the reveal presentation
      // We have to avoid to detect drag on controls (except when controls are not shown)

      var eventHammer = function(event){
        if (event.gesture && event.gesture.direction && event.gesture.distance > 1 
            && ((event.target.id && event.target.id != "controls")
               || !event.target.id)
              ){
          event.gesture.preventDefault();
          $scope.$apply(function(){
            if (event.type === 'release'){
              if (event.gesture.direction === 'left'){
                $scope.model.showMenuClass = 'collapse';                
                iElement.css('width', '');
              }else if (event.gesture.direction === 'right'){
                $scope.model.showMenuClass = 'expand';
                iElement.css('width', '');
              }
            }else if (event.gesture.direction === 'left'){
              $scope.model.showMenuClass = '';
              iElement.css('width', event.gesture.distance+'px');
            }else if (event.gesture.direction === 'right'){
              $scope.model.showMenuClass = '';
              iElement.css('width', event.gesture.distance+'px');
            }
            //console.log(event.type+":"+event.gesture.direction+":"+event.gesture.distance);
          });
        }
      }

      $(document.body).hammer().on('drag dragleft dragright release', eventHammer);
      $(iElement[0]).hammer().on('drag dragleft dragright release', eventHammer);

    }
  };
  return directiveDefinitionObject;
}]);