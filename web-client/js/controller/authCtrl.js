'use strict';

/**
 * Controller - authCtrl
 */
termonWebClient.controller('authCtrl', ['$scope', '$state', 'authService', 'AUTH_EVENTS', function($scope, $state, authService, AUTH_EVENTS) {

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
        authService.logout();
        $state.go('login');
        console.log('Sorry, You have to login again.');
    });
    
}]);
