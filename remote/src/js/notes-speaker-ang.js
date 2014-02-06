/* exported app */
'use strict';

var app = angular.module('sws', ['ngRoute', 'sws.main', 'sws.components', 'sws.plugins']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/main',       { controller: 'SwsCtrl',    templateUrl: 'partials/sws/main.html' })
    .otherwise({ redirectTo:  '/main' })
    ;
}]);