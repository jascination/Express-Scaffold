// 'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
    'myApp.controllers',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'ngRoute'
])
.config(function($routeProvider, $locationProvider) {
    // make templateUrl partials/homeholding for live version / before all live commits

    $routeProvider.
    when('/', {
        templateUrl: 'partials/home',
        controller: 'testCtrl'
    }).
    otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);
});