'use strict';

/**
 * Controller - terrariumsCtrl
 */
termonWebClient.controller('terrariumsCtrl', ['$scope', '$stateParams', '$state', '$q', '$filter', 'dataService', 'ngToast', function($scope, $stateParams, $state, $q, $filter, dataService, ngToast) {

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
            $scope.terrariums = $filter('orderBy')(data, ['-isDefault','name']);

            let promises = [];
            angular.forEach($scope.terrariums, function(terrarium) {
                let p = $q(function(resolve, reject) {

                    dataService.get('/terrarium/'+terrarium._id+'/thingies').then(function(data) {
                        terrarium.thingies = data.thingies;

                        let tPromises = [];
                        angular.forEach(terrarium.thingies, function(thingy) {
                            let p = dataService.get('/terrarium/'+terrarium._id+'/thingies/'+thingy._id+'/violations').then(function(data) {
                                thingy.violations = data;
                                // determine label category
                                let violationState = 0;
                                //console.log(thingy.violations);
                                if (thingy.violations !== undefined) {
                                for (let violation of thingy.violations.thresholdViolations) {
                                    if (violation.threshold.severity === "warning") {
                                	if (violationState < 2) {
                                	    violationState = 1;
                                	}
                                    } else {
                                	violationState = 2;
                                    }
                                }
                                // create label
                                let trigger = {
                                	clazz: "label label-success",
                                	text: "OK"
                                };
                                if (violationState === 1) {
                                    trigger.clazz = "label label-warning";
                                    trigger.text = "WARNING";
                                }
                                if (violationState === 2) {
                                    trigger.clazz = "label label-danger";
                                    trigger.text = "DANGER";
                                }
                                thingy.triggerLabel = trigger;
                                }
                            });
                            tPromises.push(p);
                        });

                        $q.all(tPromises).then(function() {
                            resolve();
                        });
                    });
                });
                promises.push(p);
            });

            $q.all(promises).then(function() {
                //Split to chunks
                $scope.terrariums = $filter('lineFilter')($scope.terrariums);
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

            let promises = [];
            angular.forEach($scope.terDetails.thingies, function(thingy) {
                let p = dataService.get('/terrarium/'+$scope.terDetails._id+'/thingies/'+thingy._id+'/violations').then(function(data) {
                    thingy.violations = data;
                    
                    // process violations
                    let states = {hum: 0, tvoc: 0, co2: 0, temp: 0};
    		
                if (thingy.violations !== undefined) {
    		for (let v of thingy.violations.thresholdViolations) {
    		    let state = 0;
    		    if (v.threshold.severity === "warning") {
    			state = 1;
    		    } else {
    			state = 2;
    		    }
    		    switch(v.threshold.sensor) {
    		    case 1: states.hum = Math.max(states.hum, state); break;
    		    case 2: states.temp = Math.max(states.temp, state); break;
    		    case 3: states.tvoc = Math.max(states.tvoc, state); break;
    		    case 4: states.co2 = Math.max(states.co2, state); break;
    		    default: break;
    		    }
    		}
    		
    		thingy.trigger = {
        	    	humidity: {clazz: "label label-success", text: "OK"},
        	    	tvoc: {clazz: "label label-success", text: "OK"},
        	    	co2: {clazz: "label label-success", text: "OK"},
        	    	temp: {clazz: "label label-success", text: "OK"}
    		};
    		
    		if (states.hum === 1) {
    		thingy.trigger.humidity = { clazz: "label label-warning", text: "WARNING" }
    		} else if (states.hum === 2) {
    		thingy.trigger.humidity = { clazz: "label label-danger", text: "DANGER" }    
    		}
    		if (states.temp === 1) {
    		thingy.trigger.temp = { clazz: "label label-warning", text: "WARNING" }
    		} else if (states.temp === 2) {
    		thingy.trigger.temp = { clazz: "label label-danger", text: "DANGER" }
    		}
    		if (states.tvoc === 1) {
    		thingy.trigger.tvoc = { clazz: "label label-warning", text: "WARNING" }
    		} else if (states.tvoc === 2) {
    		thingy.trigger.tvoc = { clazz: "label label-danger", text: "DANGER" }
    		}
    		if (states.co2 === 1) {
    		thingy.trigger.co2 = { clazz: "label label-warning", text: "WARNING" }
    		} else if (states.co2 === 2) {
    		    thingy.trigger.co2 = { clazz: "label label-danger", text: "DANGER" }
    		}
                }
                    
                    
                    
                });
                promises.push(p);
            });

            $q.all().then(function() {
                $scope.showSpinner = false;
            });
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
                $scope.config = data.config;
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
            });
            promises.push(p2);

            $q.all(promises).then(function() {
        		// check violations
        		
        		let states = {hum: 0, tvoc: 0, co2: 0, temp: 0};
        		
        		for (let v of $scope.thingyDetails.violations.thresholdViolations) {
        		    let state = 0;
        		    if (v.threshold.severity === "warning") {
        			state = 1;
        		    } else {
        			state = 2;
        		    }
        		    switch(v.threshold.sensor) {
        		    case 1: states.hum = Math.max(states.hum, state); break;
        		    case 2: states.temp = Math.max(states.temp, state); break;
        		    case 3: states.tvoc = Math.max(states.tvoc, state); break;
        		    case 4: states.co2 = Math.max(states.co2, state); break;
        		    default: break;
        		    }
        		}
        		
        		if (states.hum === 1) {
        		    $scope.thingyDetails.violation.humidity = { clazz: "label label-warning", text: "WARNING" }
        		} else if (states.hum === 2) {
        		    $scope.thingyDetails.violation.humidity = { clazz: "label label-danger", text: "DANGER" }    
        		}
        		if (states.temp === 1) {
        		    $scope.thingyDetails.violation.temp = { clazz: "label label-warning", text: "WARNING" }
        		} else if (states.temp === 2) {
        		    $scope.thingyDetails.violation.temp = { clazz: "label label-danger", text: "DANGER" }
        		}
        		if (states.tvoc === 1) {
        		    $scope.thingyDetails.violation.tvoc = { clazz: "label label-warning", text: "WARNING" }
        		} else if (states.tvoc === 2) {
        		    $scope.thingyDetails.violation.tvoc = { clazz: "label label-danger", text: "DANGER" }
        		}
        		if (states.co2 === 1) {
        		    $scope.thingyDetails.violation.co2 = { clazz: "label label-warning", text: "WARNING" }
        		} else if (states.co2 === 2) {
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
    $scope.updateConfig = function() {
	let thingy = $scope.thingyDetails;
	let terrarium = $scope.thingyDetails.ter;
	$scope.showSpinner = true;
	
	// send request
	dataService.put('/terrarium/'+terrarium._id+'/thingies/'+thingy._id+'/configuration', {config: $scope.config}).then(function(result) {
	    $scope.showSpinner = false;
	});
	
    }
    
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

    /**
     * Move Thingy with drag and drop to an other terrarium
     * @param data
     * @param evt
     * @param targetTerri
     */
    $scope.onDropComplete = function(data, evt, targetTerri){
        if (data.terri._id === targetTerri._id) {
            console.log('same terri');
            return;
        }

        $scope.showSpinner = true;
        dataService.patch('/terrarium/'+data.terri._id+'/thingies/'+data.thingy._id, {terrarium:targetTerri._id}).then(function(result) {
            $scope.loadData();

        }).catch(function(err) {
            $scope.showSpinner = false;
        });

    };

}]);
