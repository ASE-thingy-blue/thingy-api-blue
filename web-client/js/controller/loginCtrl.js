'use strict';

/**
 * Controller - loginCtrl
 */
termonWebClient.controller('loginCtrl', ['$scope', 'authService', '$state', function($scope, authService, $state) {

    $scope.loginError = undefined;

    $scope.user = {
        name: '',
        password: ''
    };

    $scope.login = function() {
        $scope.loginError = undefined;
        authService.login($scope.user).then(function(msg) {
            $state.go('private.home');
        }, function(errMsg) {
            $scope.loginError = 'Login failed: ' + errMsg;
            console.error('Error: ' + errMsg);
        });
    };

}]);
