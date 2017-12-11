'use strict';

/**
 * Controller - terrariumsCtrl
 */
termonWebClient.controller('terrariumsCtrl', ['$scope', 'dataService', function($scope, dataService) {

    $scope.terrariums = [];

    //view flags
    $scope.terDetails = null;
    $scope.thingyDetails = null;

    $scope.hideDetails = function() {
        $scope.terDetails = null;
        $scope.thingyDetails = null;
    };

    console.log('init');
    $scope.loadData = function() {
        $scope.hideDetails();

        dataService.get('/terrariums').then(function(data) {
            $scope.terrariums = data.terrariums;
            angular.forEach($scope.terrariums, function(terrarium) {
                dataService.get('/terrarium/'+terrarium._id+'/thingies').then(function(data) {
                    terrarium.thingies = data.thingies;
                });
            })
        });
    };
    $scope.loadData();

    $scope.showTerDetails = function(ter) {
        $scope.hideDetails();

        dataService.get('/terrarium/'+ter._id+'/values').then(function(data) {
            $scope.terDetails = data;
            console.log($scope.terDetails);
        });
    };

    $scope.showThingyDetails = function(ter, thingy) {
        $scope.hideDetails();
        
        dataService.get('/terrarium/'+ter._id+'/thingies/'+thingy._id+'/values').then(function(data) {
            $scope.thingyDetails = data;
            console.log($scope.thingyDetails);
        });
    };


}]);
