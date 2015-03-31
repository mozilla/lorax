/**
 * @fileOverview Accessible Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 */
define(function () {
    'use strict';

    /**
     * Accessible Chart directive
     */
    var ChartAccessibleDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ChartAccessibleController,
            templateUrl: '/app/lorax/directives/chart-accessible.tpl.html'
        };
    };

    /**
     * Controller for Accessible Chart directive
     * @constructor
     */
    var ChartAccessibleController = function (
    $scope
    ) {
        this._$scope = $scope;

        var infographic = $scope.modalIssue.issue.getInfographic();
        this._data = infographic.getDataPoints().sections;

        $scope.accessible = {
            data: this._data
        };
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    ChartAccessibleController.$inject = [
        '$scope'
    ];

    return ChartAccessibleDirective;
});
