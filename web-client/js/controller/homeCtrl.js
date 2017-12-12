'use strict';

/**
 * Controller - homeCtrl
 */
termonWebClient.controller('homeCtrl', ['$scope', 'dataService', function($scope, dataService) {

    $scope.user = {};

    //Get the logged in user
    dataService.get('/user').then(function(user) {
        $scope.user = user;
    });
    
}]);
