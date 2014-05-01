/*
* Reveal Sockets Notes : Remote App V1.0.0
*
*/
'use strict';

var app = angular.module('sws', ['ngRoute', 'ngSanitize', 'sws.main', 'sws.components', 'sws.plugins']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/main',       { controller: 'SwsCtrl',    templateUrl: 'partials/sws/main.html' })
    .otherwise({ redirectTo:  '/main' })
    ;
}]);