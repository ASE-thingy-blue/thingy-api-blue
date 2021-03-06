'use strict';

/**
 * Controller - historyCtrl
 */
termonWebClient.controller('historyCtrl', ['$scope', '$stateParams', '$state', '$filter', '$q', 'dataService', function($scope, $stateParams, $state, $filter, $q, dataService) {

    google.charts.load('current', {'packages':['corechart']});
    const googleChartPromise = $q(function(resolve, reject) {
        google.charts.setOnLoadCallback(function() {
            resolve();
        });    
    });

    $scope.user = {};
    $scope.terId = $stateParams.terId;
    $scope.thingyId = $stateParams.thingyId;

    $scope.thingyValues = {
        humidity: undefined,
        airquality: undefined,
        temperature: undefined
    };

    $scope.thingyCharts = {
        humidity: undefined,
        airquality: undefined,
        temperature: undefined
    };

    let from = new Date();
    from.setDate(from.getDate() - 7);
    let to = new Date();
    $scope.defaultValues = {
        from: from,
        to: to,
        limit: 100,
    };

    // Get the logged in user
    $scope.showSpinner = true;
    dataService.get('/user').then(function(user) {
        $scope.user = user;
        $scope.showSpinner = false;
    });

    /**
     * Load data for:
     * @param type: ['humidity', 'airquality', 'temperature']
     * @param from: Date|undefined
     * @param to: Date|undefined
     * @param limit: String|undefined (because of select)
     * @returns {*}
     */
    $scope.loadData = function(type, from, to, limit) {
        return $q(function(resolve, reject) {
            if (['humidity', 'airquality', 'temperature'].indexOf(type) === -1) {
                reject('no type provided');
            }

            // Use default from value
            if (angular.isUndefined(from)) {
                from = $scope.defaultValues.from;
            }
            // Use default to value
            if (angular.isUndefined(to)) {
                to = $scope.defaultValues.to;
            }
            // Use default limit value
            if (angular.isUndefined(limit)) {
                limit = $scope.defaultValues.limit;
            }

            const uri = '/terrarium/' + $scope.terId + '/thingies/' + $scope.thingyId + '/' + type;
            let params = {
                from: from.toISOString(),
                to: to.toISOString(),
                limit: limit
            };

            dataService.get(uri, params).then(function(data) {
                resolve({
                    from: from,
                    to: to,
                    limit: limit,
                    data: data[$scope.getMapKey(type)]
                });
            }).catch(function(error){
                reject(error);
            });
        });
    };

    /**
     * Initialize all data
     */
    $scope.initialize = function() {
        $scope.updateTemperature();
        $scope.updateHumidity();
        $scope.updateAirquality();
    };

    $scope.updateTemperature = function(from, to, limit) {
        $scope.showSpinner = true;
        $scope.loadData('temperature', from, to, limit).then(function(result) {
            googleChartPromise.then(function() {
                $scope.showSpinner = false;
                $scope.thingyValues.temperature = result;
                $scope.drawChart('temperature');
            });
        });
    };

    $scope.updateHumidity = function(from, to, limit) {
        $scope.showSpinner = true;
        $scope.loadData('humidity', from, to, limit).then(function(result) {
            googleChartPromise.then(function() {
                $scope.showSpinner = false;
                $scope.thingyValues.humidity = result;
                $scope.drawChart('humidity');
            });
        });
    };

    $scope.updateAirquality = function(from, to, limit) {
        $scope.showSpinner = true;
        $scope.loadData('airquality', from, to, limit).then(function(result) {
            googleChartPromise.then(function() {
                $scope.showSpinner = false;
                $scope.thingyValues.airquality = result;
                $scope.drawChart('airquality', ['tvoc', 'co2']);
            });
        });
    };

    //Start data display
    $scope.initialize();

    $scope.drawChart = function(type, subKeys) {
        if (angular.isUndefined($scope.thingyValues[type].data) || $scope.thingyValues[type].data.length === 0) {
            //remove chart
            if ($scope.thingyCharts[type] !== undefined) {
                $scope.thingyCharts[type].clearChart();
            }
            return;
        }

        let dataArray = [];

        if (angular.isDefined(subKeys)) {
            let k0 = subKeys[0];
            let k1 = subKeys[1];
            dataArray.push(['Date', k0, k1]);
            angular.forEach($scope.thingyValues[type].data, function(item) {
                dataArray.push([new Date(item.timestamp), item[k0].value, item[k1].value]);
            });
            
        } else {
            dataArray.push(['Date'].concat(type));
            angular.forEach($scope.thingyValues[type].data, function(item) {
                dataArray.push([new Date(item.timestamp), item.value]);
            });
        }

        let data = google.visualization.arrayToDataTable(dataArray);

        let date_formatter = new google.visualization.DateFormat({
            pattern: "dd.MM.yyyy - HH:mm:ss"
        });
        date_formatter.format(data, 0);

        // Draw chart (create if undefined)
        if ($scope.thingyCharts[type] === undefined) {
            $scope.thingyCharts[type] = new google.visualization.AreaChart(document.getElementById('chart_'+type));
        }

        let options = {
            hAxis: {
                format: 'HH:mm'
            }
        };
        $scope.thingyCharts[type].draw(data, options);

    };

    /**
     * Helper function to format the selected time range
     */
    $scope.timeRange = function(obj) {
        if (angular.isUndefined(obj) || angular.isUndefined(obj.from) || angular.isUndefined(obj.to)) {
            return 'Not loaded yet';
        }
        const format = 'dd.MM.yyyy HH:mm';
        return $filter('date')(obj.from, format) + ' - ' + $filter('date')(obj.to, format);
    };

    /**
     * Go back to Thingy or terrarium details
     * @param target: ['thingy', 'terrarium', 'overview']
     */
    $scope.goBack = function(target) {
        switch (target) {
            case 'thingy':
                $state.go('private.thingy', {terId: $scope.terId, thingyId: $scope.thingyId});
                break;
            case 'terrarium':
                $state.go('private.terrarium', {terId: $scope.terId});
                break;
            default:
                $state.go('private.terrariums', {terId: $scope.terId, thingyId: $scope.thingyId});
        }
    };

    /**
     * Map key depending on type
     * @param type: ['humidity', 'airquality', 'temperature']
     */
    $scope.getMapKey = function(type) {
        switch (type) {
            case 'humidity':
                return 'humidities';
                break;
            case 'airquality':
                return 'airQualities';
                break;
            case 'temperature':
                return 'temperatures';
                break;
            default:
                return '';
        }
    };

    /**
     * Chart name depending on type
     * @param type: ['humidity', 'airquality', 'temperature']
     */
    $scope.getChartName = function(type) {
        switch (type) {
            case 'humidity':
                return 'Humidity';
                break;
            case 'airquality':
                return 'Air Qualitiy';
                break;
            case 'temperature':
                return 'Temperature';
                break;
            default:
                return '';
        }
    }

}]);
