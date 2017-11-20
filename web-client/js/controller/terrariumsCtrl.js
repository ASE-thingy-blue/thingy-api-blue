'use strict';

/**
 * Controller - terrariumsCtrl
 */
termonWebClient.controller('terrariumsCtrl', ['$scope', 'dataService', function($scope, dataService) {

    $scope.message = 'Hello dudes!';

    dataService.get('/terrariums').then(function(data) {
        console.log(data);
    });

}]);
