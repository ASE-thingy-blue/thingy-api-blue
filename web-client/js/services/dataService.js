'use strict';

/**
 * Service - dataService
 */
termonWebClient.factory('dataService', ['$rootScope', '$q', '$http', '$filter', function($rootScope, $q, $http, $filter) {

    const dataService = {};
    dataService.api = $rootScope.url;

    dataService.get = function(getUri, searchParams) {
        return $q(function(resolve, reject) {
            var uri = getUri;
            if (angular.isDefined(searchParams)) {
                uri = uri + '?';
                var params = [];
                angular.forEach(searchParams, function (value, key) {
                    params.push(key + "=" + value)
                });
                uri += params.join('&');
            }
            $http.get(dataService.api + uri).then(function(result) {
                resolve(result.data);
            }).catch(function(error){
                reject(error);
            });
        });
    };

    dataService.post = function(postUri, payloadData) {
        return $q(function(resolve, reject) {
            $http.post(dataService.api + postUri, payloadData).then(function(result) {
                resolve(result.data);
            }).catch(function(error){
                reject(error);
            });
        });
    };

    dataService.put = function(putUri, payloadData) {
        return $q(function(resolve, reject) {
            $http.put(dataService.api + putUri, payloadData).then(function(result) {
                resolve(result.data);
            }).catch(function(error){
                reject(error);
            });
        });
    };

    dataService.patch = function(putUri, payloadData) {
        return $q(function(resolve, reject) {
            $http.patch(dataService.api + putUri, payloadData).then(function(result) {
                resolve(result.data);
            }).catch(function(error){
                reject(error);
            });
        });
    };

    dataService.delete = function(deleteUri) {
        return $q(function(resolve, reject) {
            $http.delete(dataService.api + deleteUri).then(function(result) {
                resolve(result.data);
            }).catch(function(error){
                reject(error);
            });
        });
    };

    // Public Service Methods
    return  {
        get : function(getUri, searchParams) {
            return dataService.get(getUri, searchParams);
        },
        post : function(postUri, payloadData) {
            return dataService.post(postUri, payloadData);
        },
        put : function(putUri, payloadData) {
            return dataService.put(putUri, payloadData);
        },
        patch : function(patchUri, payloadData) {
            return dataService.patch(patchUri, payloadData);
        },
        delete : function(deleteUri) {
            return dataService.delete(deleteUri);
        }
    };
}]);
