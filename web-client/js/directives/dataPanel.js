'use strict';

/**
 * Directive - dataPanel
 */
termonWebClient.directive('datapanel', ['$rootScope', '$timeout', '$compile', function ($rootScope, $timeout, $compile) {
    return {
        scope: {
            type: '=',
            chartdata: '=',
            onchangecallback: '=',
            spinner: '='
        },
        replace: false,
        templateUrl: 'static/templates/directives/dataPanel.html',
        link: function (scope, element, attrs) {

            scope.$watch('chartdata.from', function(newValue, oldValue) {
                if (angular.isDefined(newValue) && newValue !== oldValue && oldValue !== undefined) {
                    if (angular.isDefined(scope.onchangecallback)) {
                        scope.onchangecallback(scope.chartdata.from, scope.chartdata.to, scope.chartdata.limit);
                    }
                }
            });

            scope.$watch('chartdata.to', function(newValue, oldValue) {
                if (angular.isDefined(newValue) && newValue !== oldValue && oldValue !== undefined) {
                    if (angular.isDefined(scope.onchangecallback)) {
                        scope.onchangecallback(scope.chartdata.from, scope.chartdata.to, scope.chartdata.limit);
                    }
                }
            });

            scope.$watch('chartdata.limit', function(newValue, oldValue) {
                if (angular.isDefined(newValue) && newValue !== oldValue && oldValue !== undefined) {
                    if (angular.isDefined(scope.onchangecallback)) {
                        scope.onchangecallback(scope.chartdata.from, scope.chartdata.to, scope.chartdata.limit);
                    }
                }
            });

            scope.testDate = new Date();

            scope.options =  [
                {value: 10, name: 'Show 10 values'},
                {value: 50, name: 'Show 50 values'},
                {value: 100, name: 'Show 100 values'},
                {value: 150, name: 'Show 150 values'},
                {value: 200, name: 'Show 200 values'},
                {value: 250, name: 'Show 250 values'},
                {value: 500, name: 'Show 500 values'}
            ];
        }
    }
}]);