'use strict';

/**
 * Controller - homeCtrl
 */
termonWebClient.controller('homeCtrl', ['$scope', '$state', '$q', 'dataService', function($scope, $state, $q, dataService) {

    $scope.user = {};

    //Get the logged in user
    dataService.get('/user').then(function(user) {
        $scope.user = user;
    });

    $scope.terrariums = [];
    $scope.thingies = [];

    /**
     *  Load Terrarium and Thingy data
     */
    $scope.loadData = function() {
        $scope.showSpinner = true;
        
        dataService.get('/terrarium').then(function(data) {
            $scope.terrariums = data;

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
                $scope.thingies = [];
                angular.forEach($scope.terrariums, function(terrarium) {
                    angular.forEach(terrarium.thingies, function(thingy) {
                        thingy.terId = terrarium._id;
                        $scope.thingies.push(thingy);
                    });
                });
                $scope.showSpinner = false;
            });
        });
    };
    $scope.loadData();

    /**
     * Directly open Thingy Details in terrariumCtrl
     * @param terId
     * @param thingyId
     */
    $scope.goToThingyDetails = function(terId, thingyId) {
        $state.go('private.thingy', {terId: terId, thingyId: thingyId});
    };

}]);
