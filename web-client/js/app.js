'use strict';

/**
 * Module - termonWebClient
 */
var termonWebClient = angular.module('termonWebClient', ['ui.router', 'ngAnimate', 'ngAria', 'ngCookies', 'ngMessages', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'ui.bootstrap.datetimepicker', 'ngDraggable', 'ngToast'])
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
            .state('private.terrarium', {
                url: '/terrariums/:terId',
                templateUrl: 'static/templates/controller/terrariums.html',
                controller: 'terrariumsCtrl'
            })
            .state('private.thingy', {
                url: '/terrariums/:terId/:thingyId',
                templateUrl: 'static/templates/controller/terrariums.html',
                controller: 'terrariumsCtrl'
            })
            .state('private.history', {
                url: '/history/:terId/:thingyId',
                templateUrl: 'static/templates/controller/history.html',
                controller: 'historyCtrl'
            })
            .state('private.profile', {
                url: '/profile',
                templateUrl: 'static/templates/controller/profile.html',
                controller: 'profileCtrl'
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
    .run(['$rootScope', '$transitions', '$location', function($rootScope, $transitions, $location) {

        //Change for Production
        $rootScope.url = $location.protocol()+ '://' + $location.host();
        if ($location.port() !== 80 || $location.port() !== 443) {
            $rootScope.url = $rootScope.url + ':' + $location.port();
        }

        //Redirect unauthenticated User to Login page
        $transitions.onStart({ to: 'private.**' }, function(transition) {
            let auth = transition.injector().get('authService');
            if (!auth.isAuthenticated()) {
                // User isn't authenticated. Redirect to login state.
                return transition.router.stateService.target('public.login');
            }
        });

        //Redirect authenticated User to Home page
        $transitions.onStart({ to: 'public.**' }, function(transition) {
            var auth = transition.injector().get('authService');
            if (auth.isAuthenticated()) {
                // User is authenticated. Redirect to Home page.
                return transition.router.stateService.target('private.home');
            }
        });

    }]);
