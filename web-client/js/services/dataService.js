'use strict';

/**
 * Service - dataService
 */
termonWebClient.factory('dataService', ['$http', '$filter', function($http, $filter) {
    // API Request Config
    var apiConfig = {
        'headers' : {
            'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8'
        }
    };
    var apiConfigPut = {
        'headers' : {
            'Content-Type' : 'application/json;charset=utf-8'
        }
    };
    var apiUrl = 'api/';

    // Data Service
    var dataService = {};
    dataService.initialized = false;

    // Data Service initialisieren
    dataService.initialize = function(callback) {
        // Nur einmal initialisieren, falls bereits aufgerufen wurde.
        if (!dataService.initialized)  {
            dataService.initialized = true;
            callback();
        } else {
            callback(true);
        }
    }

    // Public Service Methods
    return  {
        initialized : function() {
            return dataService.initialized;
        },
        initialize : function(callback) {
            dataService.initialize(callback);
        }
    };
}]);
