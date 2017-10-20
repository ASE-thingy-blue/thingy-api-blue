'use strict';

/**
 * Controller - navigationCtrl
 */
termonWebClient.controller('navigationCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {

    $scope.navigation = [
        {
            name: 'Home',
            path: '/home',
            icon: 'fa-home'
        }, {
            name: 'Test',
            path: '/test',
            icon: 'fa-gear'
        }
    ];

    $scope.isActive = function(nav) {
        var url = $location.url();
        return nav.path == url;
    }

    $scope.navigate = function(nav) {
        $('#collapsed-navbar').collapse('hide');
        $location.path(nav.path);
    }

}]);