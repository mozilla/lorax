/**
 * @fileOverview Cloud Security Chart directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
    'use strict';

    /**
     * Cloud Security Chart directive
     */
    var ChartCloudSecurityDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ChartCloudSecurityController,
            templateUrl: '/app/lorax/directives/chart-cloud-security.tpl.html'
        };
    };

    /**
     * Controller for Cloud Security Chart directive
     * @constructor
     */
    var ChartCloudSecurityController = function (
        $scope,
        $timeout
        )
    {
        this._$scope = $scope;
        this._$timeout = $timeout;

        var infographic = $scope.modalIssue.issue.getInfographic();
        this._data = infographic.getDataPoints().newsSource;

        $scope.news = {
            data: this._data
        };
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    ChartCloudSecurityController.$inject = [
        '$scope',
        '$timeout'
    ];

    return ChartCloudSecurityDirective;
});
