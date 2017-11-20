'use strict';

/**
 * Module - termonWebClient
 */
var termonWebClient = angular.module('termonWebClient', ['ui.router', 'ngAnimate', 'ngAria', 'ngCookies', 'ngMessages', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch'])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){

        // Router Konfiguration
        $stateProvider
            .state('public', {
                templateUrl: 'static/templates/public.html'
            })
            .state('public.login', {
                url: '/login',
                templateUrl: 'static/templates/controller/login.html',
                controller: 'loginCtrl'
            })
            .state('public.register', {
                url: '/register',
                templateUrl: 'static/templates/controller/register.html',
                controller: 'registerCtrl'
            })
            .state('private', {
                templateUrl: 'static/templates/private.html',
            })
            .state('private.home', {
                url: '/home',
                templateUrl: 'static/templates/controller/home.html',
                controller: 'homeCtrl'
            })
            .state('private.logout', {
                url: '/logout',
                controller: 'logoutCtrl'
            });

        $urlRouterProvider.otherwise('/login');

        $locationProvider.hashPrefix('');

    }])
    .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated'
    })
    .constant('API_ENDPOINT', {
        url: 'http://127.0.0.1:8080'
        //  For a simulator use: url: 'http://127.0.0.1:8080/api'
    })
    .run(['$rootScope', '$state', 'authService', 'dataService', 'AUTH_EVENTS', function($rootScope, $state, authService, dataService, AUTH_EVENTS) {

        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
            console.log('$stateChangeStart');
            if (!authService.isAuthenticated()) {
                console.log(next.name);
                if (next.name !== 'public.login' && next.name !== 'public.register') {
                    event.preventDefault();
                    $state.go('public.login');
                }
            }
        });

        // Initialisierung
        dataService.initialize(function(data) {
            console.log('init-done');
        });

    }]);
