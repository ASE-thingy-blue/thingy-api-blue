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
            .state('private.terrariums', {
                url: '/terrariums',
                templateUrl: 'static/templates/controller/terrariums.html',
                controller: 'terrariumsCtrl'
            })
            .state('private.thingies', {
                url: '/thingies',
                templateUrl: 'static/templates/controller/thingies.html',
                controller: 'thingiesCtrl'
            })
            .state('private.settings', {
                url: '/settings',
                templateUrl: 'static/templates/controller/settings.html',
                controller: 'settingsCtrl'
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
        devUrl: 'http://127.0.0.1:8080',
        testUrl: 'https://test.termon.pillo-srv.ch',
        prodUrl: 'https://termon.pillo-srv.ch',
    })
    .run(['$rootScope', '$transitions', 'dataService', 'API_ENDPOINT', function($rootScope, $transitions, dataService, API_ENDPOINT) {

        //Change for Production
        var env = 'dev'; //one of ['dev', 'test', 'prod']

        $rootScope.apiEndpoint = function() {
            return API_ENDPOINT[env+'Url']
        };

        //Redirect unauthenticated User to Login page
        $transitions.onStart({ to: 'private.**' }, function(transition) {
            var auth = transition.injector().get('authService');
            if (!auth.isAuthenticated()) {
                // User isn't authenticated. Redirect to login state.
                return transition.router.stateService.target('public.login');
            }
        });

        //Redirect authenticated User to Home page
        $transitions.onStart({ to: 'public.**' }, function(transition) {
            var auth = transition.injector().get('authService');
            if (auth.isAuthenticated()) {
                // User isn't authenticated. Redirect to login state.
                return transition.router.stateService.target('private.home');
            }
        });

        // Initialisierung
        dataService.initialize(function(data) {
            console.log('init-done');
        });

    }]);
