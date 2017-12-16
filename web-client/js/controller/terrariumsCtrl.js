'use strict';

/**
 * Controller - terrariumsCtrl
 */
termonWebClient.controller('terrariumsCtrl', ['$scope', '$stateParams', '$state', '$q', 'dataService', 'ngToast', function($scope, $stateParams, $state, $q, dataService, ngToast) {

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
    $scope.loadData = function(initial) {
        $scope.showSpinner = true;
        $scope.hideDetails();
        dataService.get('/terrarium').then(function(data) {
            $scope.terrariums = data;
            let promises = [];
            angular.forEach($scope.terrariums, function(terrarium) {
                let p = dataService.get('/terrarium/'+terrarium._id+'/thingies').then(function(data) {
                    terrarium.thingies = data.thingies;
                });
                promises.push(p);
            });

            $q.all(promises).then(function() {
                //Thingy or Terrarium detail view
                if (initial) {
                    if (angular.isDefined($stateParams.thingyId) && angular.isDefined($stateParams.terId)) {
                        $scope.showThingyDetails({_id:$stateParams.terId}, {_id:$stateParams.thingyId})
                    } else if (angular.isDefined($stateParams.terId)) {
                        $scope.showTerDetails({_id:$stateParams.terId})
                    } else {
                        $scope.showSpinner = false;
                    }
                } else {
                    $scope.showSpinner = false;
                }
            });
        });
    };
    $scope.loadData(true);

    /**
     * Show Detail view for 1 terrarium (list of thingies with values)
     * @param ter: Terrarium
     */
    $scope.showTerDetails = function(ter) {
        $scope.showSpinner = true;
        $scope.hideDetails();

        dataService.get('/terrarium/'+ter._id).then(function(data) {
            $scope.terDetails = data;
            $scope.showSpinner = false;
        });
    };

    /**
     * Show Detail view for 1 terrarium (list of thingies with values)
     * @param ter: Terrarium
     * @param thingy: Thingy
     */
    $scope.showThingyDetails = function(ter, thingy) {
        $scope.showSpinner = true;
        $scope.hideDetails();

        dataService.get('/terrarium/'+ter._id+'/thingies/'+thingy._id).then(function(data) {
            $scope.thingyDetails = data;
            $scope.thingyDetails.ter = ter;
            let promises = [];
            //Load configuration and violations
            let p1 = dataService.get('/terrarium/'+ter._id+'/thingies/'+thingy._id+'/configuration').then(function(data) {
                $scope.thingyDetails.configuration = data;
                //console.log($scope.thingyDetails.configuration);
            });
            promises.push(p1);
            // thingy violations. (default values)
            $scope.thingyDetails.violation = {
        	    	humidity: {clazz: "label label-success", text: "OK"},
        	    	tvoc: {clazz: "label label-success", text: "OK"},
        	    	co2: {clazz: "label label-success", text: "OK"},
        	    	temp: {clazz: "label label-success", text: "OK"}
            };
            let p2 = dataService.get('/terrarium/'+ter._id+'/thingies/'+thingy._id+'/violations').then(function(data) {
                $scope.thingyDetails.violations = data;
                console.log($scope.thingyDetails.violations);
            });
            promises.push(p2);

            $q.all(promises).then(function() {
        		// check violations
        		console.log($scope.thingyDetails.violations.thresholdViolations);
        		let states = {hum: 0, tvoc: 0, co2: 0, temp: 0};
        		
        		for (let v of $scope.thingyDetails.violations.thresholdViolations) {
        		    switch(v.threshold.sensor) {
        		    case 1: states.hum = 1; break;
        		    case 2: states.temp = 1; break;
        		    case 3: states.tvoc = 1; break;
        		    case 4: states.co2 = 1; break;
        		    default: break;
        		    }
        		}
        		
        		if (states.hum === 1) {
        		    $scope.thingyDetails.violation.humidity = { clazz: "label label-danger", text: "DANGER" }
        		}
        		if (states.temp === 1) {
        		    $scope.thingyDetails.violation.temp = { clazz: "label label-danger", text: "DANGER" }
        		}
        		if (states.tvoc === 1) {
        		    $scope.thingyDetails.violation.tvoc = { clazz: "label label-danger", text: "DANGER" }
        		}
        		if (states.co2 === 1) {
        		    $scope.thingyDetails.violation.co2 = { clazz: "label label-danger", text: "DANGER" }
        		}
        	
        		// spinner off
                $scope.showSpinner = false;
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

        dataService.post('/terrarium', ter).then(function(result) {
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

    $scope.showHistory = function(ter, thingy) {
        $state.go('private.history', {terId: ter._id, thingyId: thingy._id})
    };

    /**
     * Update name and description of a terrarium
     * @param terrarium
     */
    $scope.updateTerri = function(terrarium) {
        $scope.showSpinner = true;

        dataService.put('/terrarium/'+terrarium._id, {name:terrarium.uName,  description:terrarium.uDescription}).then(function(result) {
            terrarium.description = terrarium.uDescription;
            terrarium.name = terrarium.uName;
            terrarium.showForm = false;
            terrarium.uName = '';
            terrarium.uDescription = '';
            $scope.showSpinner = false;
        }).catch(function(err) {
            terrarium.showForm = false;
            terrarium.uName = '';
            terrarium.uDescription = '';
            $scope.showSpinner = false;
        });
    };

    /**
     * Update name of a thingy
     * @param terrarium
     * @param thingy
     */
    $scope.updateThingy = function(terrarium, thingy) {
        $scope.showSpinner = true;

        dataService.put('/terrarium/'+terrarium._id+'/thingies/'+thingy._id, {description:thingy.uDescription}).then(function(result) {
            thingy.description = thingy.uDescription;
            thingy.showForm = false;
            thingy.uDescription = '';
            $scope.showSpinner = false;
        }).catch(function(err) {
            thingy.showForm = false;
            thingy.uDescription = '';
            $scope.showSpinner = false;
        });
    };

}]);
