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
        $scope.showSpinner = true;

        dataService.get('/terrariums').then(function(data) {
            $scope.terrariums = data.terrariums;
            angular.forEach($scope.terrariums, function(terrarium) {
                dataService.get('/terrarium/'+terrarium._id+'/thingies').then(function(data) {
                    terrarium.thingies = data.thingies;
                });
            });
            $scope.showSpinner = false;
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
        $scope.modalError = undefined;
        $scope.terToCreate = {};
        $('#createTerrariumModal').modal('show');
    };

    /**
     * Saves a new terrarium over the API
     * @param ter: Terrarium
     */
    $scope.createTerrarium = function(ter) {
        $scope.showSpinner = true;

        dataService.post('/terrariums', ter).then(function(result) {
            $scope.terToCreate = undefined;
            $scope.loadData();
            $('#createTerrariumModal').modal('hide');
        }).catch(function(err) {
            if (err.data.message) {
                $scope.modalError = err.data.message;
            } else {
                $scope.modalError = "Error connecting to server.";
            }
            $scope.showSpinner = false;
        });
    };

    /**
     * Opens a modal to delete an existing terrarium
     * @param ter: Terrarium
     */
    $scope.showDeleteTerrarium = function(ter) {
        $scope.modalError = undefined;
        $scope.terToDelete = angular.copy(ter);
        $('#deleteTerrariumModal').modal('show');
    };

    /**
     * Deletes an existing terrarium over the API
     * @param ter: Terrarium
     */
    $scope.deleteTerrarium = function(ter) {
        $scope.showSpinner = true;

        dataService.delete('/terrarium/' + ter._id).then(function(result) {
            $scope.terToDelete = undefined;
            $scope.loadData();
            $('#deleteTerrariumModal').modal('hide');
        }).catch(function(err) {
            if (err.data.message) {
                $scope.modalError = err.data.message;
            } else {
                $scope.modalError = "Error connecting to server.";
            }
            $scope.showSpinner = false;
        });
    };


}]);
