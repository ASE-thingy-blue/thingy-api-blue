'use strict';

/**
 * Controller - historyCtrl
 */
termonWebClient.controller('historyCtrl', ['$scope', '$stateParams', '$state', 'dataService', function($scope, $stateParams, $state, dataService) {

    $scope.user = {};
    $scope.terId = $stateParams.terId;
    $scope.thingyId = $stateParams.thingyId;

    //Get the logged in user
    $scope.showSpinner = true;
    dataService.get('/user').then(function(user) {
        $scope.user = user;
        $scope.showSpinner = false;
    });

    //Go Back to Thingy or Terrarium Details
    $scope.goBack = function(target) {
        switch (target) {
            case 'thingy':
                $state.go('private.thingy', {terId: $scope.terId, thingyId: $scope.thingyId});
                break;
            case 'terrarium':
                $state.go('private.terrarium', {terId: $scope.terId});
                break;
            default:
                $state.go('private.terrariums', {terId: $scope.terId, thingyId: $scope.thingyId});
        }
    }

}]);
