'use strict';

/**
 * Service - dataService
 */
termonWebClient.factory('dataService', ['$rootScope', '$q', '$http', '$filter', function($rootScope, $q, $http, $filter) {

    const dataService = {};
    dataService.api = $rootScope.apiEndpoint();

    dataService.get = function(getUri, searchParams) {
        return $q(function(resolve, reject) {
            let uri = getUri;
            if (angular.isDefined(searchParams)) {
                //TODO, add params
                uri = uri + '?';
            }
            $http.get(dataService.api + uri).then(function(result) {
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
        }
    };
}]);
