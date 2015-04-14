/**
 * @fileOverview Data Portability Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 */
define(function() {
    'use strict';

    /**
     * Data Portability Chart directive
     */
    var ChartDataPortabilityDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ChartDataPortabilityController,
            templateUrl: '/app/lorax/directives/chart-data-portability.tpl.html'
        };
    };

    /**
     * Controller for Data Portability Chart directive
     * @constructor
     */
    var ChartDataPortabilityController = function (
        $scope,
        $timeout
        )
    {
        this._$scope = $scope;
        this._$timeout = $timeout;

        var infographic = $scope.modalIssue.issue.getInfographic();
        this._data = infographic.getDataPoints().dataStandards;
        this._localeData = infographic.getDataPoints().labels;

        $scope.dataStandards = {
            data: this._data,
            localeData: this._localeData
        };
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    ChartDataPortabilityController.$inject = [
        '$scope',
        '$timeout'
    ];

    return ChartDataPortabilityDirective;
});
