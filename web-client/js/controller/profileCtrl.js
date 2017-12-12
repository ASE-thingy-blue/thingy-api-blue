'use strict';

/**
 * Controller - profileCtrl
 */
termonWebClient.controller('profileCtrl', ['$scope', 'dataService', function($scope, dataService) {

    $scope.user = {};
    $scope.errorMsg = undefined;
    $scope.successMsg = undefined;

    dataService.get('/user').then(function(user) {
        $scope.user = user;
    });

    $scope.updateProfile = function() {
        $scope.errorMsg = undefined;
        $scope.successMsg = undefined;

        let user = {
            mailAddress: $scope.user.mailAddress,
            password: $scope.user.password,
            repassword: $scope.user.repassword
        };

        dataService.put('/user', user).then(function(result) {
            console.log(result);
            if (result.success) {
                $scope.successMsg = result.message;
            } else {
                $scope.errorMsg = result.message;
            }
        }).catch(function(err) {
            $scope.errorMsg = "Error connecting to server.";
        });
    };

}]);
