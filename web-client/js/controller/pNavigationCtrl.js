'use strict';

/**
 * Controller - pNavigationCtrl
 */
termonWebClient.controller('pNavigationCtrl', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    $scope.navigation = [
        {
            name : 'Login',
            path : '/login',
            state : 'public.login',
            icon : 'fa-sign-in'
        }, {
            name : 'Register',
            path : '/register',
            state : 'public.register',
            icon : 'fa-plus'
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
