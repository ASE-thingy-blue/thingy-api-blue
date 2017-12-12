'use strict';

/**
 * Service - authService
 */
termonWebClient.factory('authService', ['$rootScope', '$q', '$http', function($rootScope, $q, $http) {
    var LOCAL_TOKEN_KEY = 'termon-client-token-key';
    var isAuthenticated = false;
    var authToken;

    function loadUserCredentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        if (token) {
            useCredentials(token);
        }
    }

    function storeUserCredentials(token) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        useCredentials(token);
    }

    function useCredentials(token) {
        isAuthenticated = true;
        authToken = token;

        // Set the token as header for your requests!
        $http.defaults.headers.common.Authorization = authToken;
    }

    function destroyUserCredentials() {
        authToken = undefined;
        isAuthenticated = false;
        $http.defaults.headers.common.Authorization = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    var register = function(user) {
        return $q(function(resolve, reject) {
            $http.post($rootScope.url + '/signup', user).then(function(result) {
                if (result.data.success) {
                    resolve(result.data.message);
                } else {
                    reject(result.data.message);
                }
            }).catch(function(error) {
                if (error.data.message) {
                    reject(error.data.message);
                } else {
                    reject('Can\'t connect to Server.');
                }
            });
        });
    };

    var login = function(user) {
        return $q(function(resolve, reject) {
            $http.post($rootScope.url + '/authenticate', user).then(function(result) {
                if (result.data.success) {
                    storeUserCredentials(result.data.token);
                    resolve(result.data.message);
                } else {
                    reject(result.data.message);
                }
            }).catch(function(error) {
                if (error.data.message) {
                    reject(error.data.message);
                } else {
                    reject('Can\'t connect to Server.');
                }
            });
        });
    };

    var logout = function() {
        destroyUserCredentials();
    };

    loadUserCredentials();

    return {
        login: login,
        register: register,
        logout: logout,
        isAuthenticated: function() {return isAuthenticated;},
    };
}]);
