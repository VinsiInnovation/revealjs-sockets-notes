components.directive('slidingMenu', ['$rootScope','$injector'
  ,function ($rootScope,$injector) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/slidingmenu.html',
    replace: true,
    priority : 903,
    require: '^sws',
    restrict: 'E',
    scope: true,    
    transclude : true,
    link: function postLink($scope, iElement, iAttrs, swsControl) { 

      var srcollElement = iElement.find('.main-content-app-scroll');
      /*
      * Swype management
      */

      // We add a managment of gesture in order to control the reveal presentation
      // We have to avoid to detect drag on controls (except when controls are not shown)
      var expandDirection = true;
      var lastState = 'collapse';
      $(document.body).hammer().on('touch drag dragstart dragleft dragright release', function(event){
        // We check that we had a minimum mouvement
        if (event.gesture && event.gesture.direction && event.gesture.distance > 1 
            // We check that we are not on a forbidden id (plugins / preview area)
            && ((event.target.id && $scope.ui.excludeArray.indexOf(event.target.id) === -1)
               || !event.target.id)
              ){
          // We cancel the event          
          $scope.$apply(function(){
            // We check the direction and we have to take care of the original position
            if (event.type === 'release'){
              srcollElement[0].style[Modernizr.prefixed('transform')] = '';
              if (event.gesture.direction === 'left'){
                $scope.ui.showMenuClass = lastState ===  'collapse' ? 'expand-plugin' : 'collapse';       
                event.gesture.preventDefault();
              }else if (event.gesture.direction === 'right'){
                $scope.ui.showMenuClass = lastState ===  'collapse' ? 'expand-menu' : 'collapse';
                event.gesture.preventDefault();
              }
            }else if (event.type === 'dragstart' || event.type === 'touch'){
              expandDirection = $scope.ui.showMenuClass === 'collapse';
              event.gesture.preventDefault();
            }else if (event.type === 'drags' || event.type === 'dragleft'  || event.type === 'dragright'){
              if ($scope.ui.showMenuClass != ''){                
                lastState = ''+$scope.ui.showMenuClass;
              }
              $scope.ui.showMenuClass = '';
              var deltaX = lastState === 'expand-menu' ? 300 : -300;
              var delta = lastState === 'collapse' ? event.gesture.deltaX : Math.round( deltaX + event.gesture.deltaX); 
              srcollElement[0].style[Modernizr.prefixed('transform')] = 'translateX('+delta+'px)';
              event.gesture.preventDefault();
            }
          });
        }
      }); 

    }
  };
  return directiveDefinitionObject;
}]);