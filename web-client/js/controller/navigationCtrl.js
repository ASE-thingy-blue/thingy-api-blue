'use strict';

/**
 * Controller - navigationCtrl
 */
termonWebClient.controller('navigationCtrl', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    $scope.navigation = [
        {
            name : 'Home',
            path : '/home',
            state : 'private.home',
            icon : 'fa-home'
        }, {
            name : 'Terrariums',
            path : '/terrariums',
            state : 'private.terrariums',
            icon : 'fa-th'
        }, {
            name : 'Thingies',
            path : '/thingies',
            state : 'private.thingies',
            icon : 'fa-th-large'
        }, {
            name : 'Settings',
            path : '/settings',
            state : 'private.settings',
            icon : 'fa-gear'
        }, {
            name : 'Logout',
            path : '/logout',
            state : 'private.logout',
            icon : 'fa-sign-out'
        }
    ];

    $scope.isActive = function(nav) {
        let state = $state.current.name;
        return nav.state === state;
    };

    $scope.navigate = function(nav) {
        $('#collapsed-navbar').collapse('hide');
        $state.go(nav.state);
    };

}]);
