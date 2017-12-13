'use strict';

/**
 * Controller - logoutCtrl
 */
termonWebClient.controller('logoutCtrl', ['$scope', 'authService', '$state', function($scope, authService, $state) {

    //Logout User and redirect to Login Page
    authService.logout();
    $state.go('public.login');

}]);
