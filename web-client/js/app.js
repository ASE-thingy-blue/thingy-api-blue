'use strict';

/**
 * Module - termonWebClient
 */
var termonWebClient = angular.module('termonWebClient', ['ngAnimate', 'ngAria', 'ngCookies', 'ngMessages', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

        // Router Konfiguration
        $routeProvider.
            when( '/home', {
                templateUrl: './static/templates/home.html',
                controller: 'homeCtrl'
            }).
            otherwise({redirectTo: '/home'});

        $locationProvider.hashPrefix('');

    }])

    .run(['$rootScope', 'dataService', function($rootScope, dataService) {

        //Initialisierung
        dataService.initialize(function(data){
            console.log('init-done');
        });

    }]);
