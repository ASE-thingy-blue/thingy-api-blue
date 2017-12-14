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
            alt : ['private.terrarium', 'private.thingy'],
            icon : 'fa-th'
        }, {
            name : 'Profile',
            path : '/profile',
            state : 'private.profile',
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
        return nav.state === state || (nav.alt && nav.alt.indexOf(state) > -1);
    };

    $scope.navigate = function(nav) {
        $('#collapsed-navbar').collapse('hide');
        $state.go(nav.state);
    };

}]);
