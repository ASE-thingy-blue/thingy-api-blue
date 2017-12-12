'use strict';

/**
 * Controller - profileCtrl
 */
termonWebClient.controller('profileCtrl', ['$scope', 'dataService', function($scope, dataService) {

    $scope.user = {};
    $scope.errorMsg = undefined;
    $scope.successMsg = undefined;

    //Get the logged in user
    dataService.get('/user').then(function(user) {
        $scope.user = user;
    });

    /**
     * Update the users profile over API
     */
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
            if (err.data.message) {
                $scope.errorMsg = err.data.message;
            } else {
                $scope.errorMsg = "Error connecting to server.";
            }
        });
    };

}]);
