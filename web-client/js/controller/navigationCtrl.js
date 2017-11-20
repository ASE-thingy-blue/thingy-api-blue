'use strict';

/**
 * Controller - navigationCtrl
 */
termonWebClient.controller('navigationCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {

    $scope.navigation = [
        {
            name : 'Home',
            path : '/home',
            icon : 'fa-home'
        }, {
            name : 'Test',
            path : '/test',
            icon : 'fa-gear'
        }, {
            name : 'Logout',
            path : '/logout',
            icon : 'fa-sign-out '
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
