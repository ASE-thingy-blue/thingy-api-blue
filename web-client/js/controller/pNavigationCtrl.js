'use strict';

/**
 * Controller - pNavigationCtrl
 */
termonWebClient.controller('pNavigationCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {

    $scope.navigation = [
        {
            name : 'Login',
            path : '/login',
            icon : 'fa-sign-in'
        }, {
            name : 'Register',
            path : '/register',
            icon : 'fa-plus'
        }
    ];

    $scope.isActive = function(nav) {
        let url = $location.url();
        return nav.path === url;
    };

    $scope.navigate = function(nav) {
        $('#collapsed-navbar').collapse('hide');
        $location.path(nav.path);
    };

}]);
