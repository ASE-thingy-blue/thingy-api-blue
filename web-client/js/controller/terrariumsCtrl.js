'use strict';

/**
 * Controller - terrariumsCtrl
 */
termonWebClient.controller('terrariumsCtrl', ['$scope', 'dataService', 'ngToast', function($scope, dataService, ngToast) {

    $scope.terrariums = [];

    //view flags (currently displayed objects)
    $scope.terDetails = null;
    $scope.thingyDetails = null;

    /**
     * Resets the view
     */
    $scope.hideDetails = function() {
        $scope.terDetails = null;
        $scope.thingyDetails = null;
    };

    /**
     *  Load Terrarium and Thingy data
     */
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

    /**
     * Show Detail view for 1 terrarium (list of thingies with values)
     * @param ter: Terrarium
     */
    $scope.showTerDetails = function(ter) {
        $scope.hideDetails();

        dataService.get('/terrarium/'+ter._id+'/values').then(function(data) {
            $scope.terDetails = data;
        });
    };

    /**
     * Show Detail view for 1 terrarium (list of thingies with values)
     * @param ter: Terrarium
     * @param thingy: Thingy
     */
    $scope.showThingyDetails = function(ter, thingy) {
        $scope.hideDetails();
        
        dataService.get('/terrarium/'+ter._id+'/thingies/'+thingy._id+'/values').then(function(data) {
            $scope.thingyDetails = data;
            //Load configuration and violations
            dataService.get('/terrarium/'+ter._id+'/thingies/'+thingy._id+'/configuration').then(function(data) {
                $scope.thingyDetails.configuration = data;
                console.log($scope.thingyDetails.configuration);
            });
            dataService.get('/terrarium/'+ter._id+'/thingies/'+thingy._id+'/violations').then(function(data) {
                $scope.thingyDetails.violations = data;
                console.log($scope.thingyDetails.violations);
            });
        });
    };

    /**
     * Opens a modal to create a new terrarium
     */
    $scope.showCreateTerrarium = function() {

    };

    /**
     * Saves a new terrarium over the API
     */
    $scope.createTerrarium = function() {

    };

    /**
     * Opens a modal to delete an existing terrarium
     * @param ter: Terrarium
     */
    $scope.showDeleteTerrarium = function(ter) {

    };

    /**
     * Deletes an existing terrarium over the API
     * @param ter: Terrarium
     */
    $scope.deleteTerrarium = function(ter) {

    };


}]);
