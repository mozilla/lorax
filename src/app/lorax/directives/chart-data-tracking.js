/**
 * @fileOverview Data Tracking Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 */
define(['jquery'], function ($) {
    'use strict';

    /**
     * Terms & Conditions Chart directive
     */
    var ChartDataTrackingDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ChartDataTrackingController,
            link: ChartDataTrackingLinkFn
        };
    };

    /**
     * Controller for Data Tracking Chart directive
     * @constructor
     */
    var ChartDataTrackingController = function (
        $scope,
        $timeout,
        utilsService
        )
    {
        this._$scope = $scope;
        this._$timeout = $timeout;
        this._utilsService = utilsService;
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    ChartDataTrackingController.$inject = [
        '$scope',
        '$timeout',
        'utilsService'
    ];

    /**
     * Link function for Data Tracking Chart directive
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      jQuery element.
     * @param {object} iAttrs     Directive attributes.
     * @param {object} controller Controller reference.
     */
    var ChartDataTrackingLinkFn = function (scope, iElem, iAttrs, controller) {
        controller._$timeout(function() {

            var $modal =  $('#modal-issue');

            var container = $('.infographic__wrapper div', $modal);
            var graphWidth = container.width();

            var width = Math.round(graphWidth);
            var height = Math.round(graphWidth / 1.5);

            var infographic = scope.modalIssue.issue.getInfographic();
            var trackers = infographic.getDataPoints().trackers;
            var graphData = [];

            var margin = { top: 0, right: 30, bottom: 150, left: 40 };
            var chart = controller._utilsService.columnChart()
              .margin(margin)
              .width(width)
              .height(height)
              .yAxisFormat(d3.format("%"))
              .formatX(true)
              .xGrid(true);

            // transform the raw data into what the below function expects
            for (var i = 0, l = trackers.length; i < l; i++) {
                var trackerData = trackers[i].tracker + ' - ' + trackers[i].company;
                graphData.push([trackerData, trackers[i].percent]);
            }

            var selection = d3.select('.infographic__wrapper div', $modal);
            selection.datum(graphData).call(chart);

            // if there is a source for the infographic, add it.
            if (infographic._source.name) {
                controller._utilsService.addSource(infographic._source, container);
            }

        }.bind(controller));
    };

    return ChartDataTrackingDirective;
});
