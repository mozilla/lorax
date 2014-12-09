/**
 * @fileOverview Content Creation Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 */
define(function () {
    'use strict';

    /**
     * Content Creation Chart directive
     */
    var ChartContentCreationDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ChartContentCreationController,
            templateUrl: '/app/lorax/directives/chart-content-creation.tpl.html'
        };
    };

    /**
     * Controller for Content Creation Chart directive
     * @constructor
     */
    var ChartContentCreationController = function (
    $scope
    ) {
        this._$scope = $scope;

        this._data = $scope.issue.getInfographic().getDataPoints().quote;

        $scope.contentCreation = {
            data: this._data
        };
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    ChartContentCreationController.$inject = [
        '$scope'
    ];

    return ChartContentCreationDirective;
});
