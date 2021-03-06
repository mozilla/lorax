/**
 * @fileOverview Common Languages Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 * @author <a href='mailto:sneethling@mozilla.com'>Schalk Neethling</a>
 */
define(['jquery', 'd3'], function ($, d3) {
    'use strict';

    /**
     * Common Languages Chart directive
     */
    var ChartCommonLanguagesDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ChartCommonLanguagesController,
            link: ChartCommonLanguagesLinkFn
        };
    };

    /**
     * Controller for Common Languages Chart directive
     * @constructor
     */
    var ChartCommonLanguagesController = function (
        $scope,
        $timeout,
        utilsService
    ) {
        this._$scope = $scope;
        this._$timeout = $timeout;
        this._utilsService = utilsService;
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    ChartCommonLanguagesController.$inject = [
        '$scope',
        '$timeout',
        'utilsService'
    ];

    /**
     * Link function for Common Languages Chart directive
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      jQuery element.
     * @param {object} iAttrs     Directive attributes.
     * @param {object} controller Controller reference.
     */
    var ChartCommonLanguagesLinkFn = function (scope, iElem, iAttrs, controller) {
        controller._$timeout(function() {

            var $modal =  $('#modal-issue');

            var margin = { top: 50, right: 30, bottom: 30, left: 75 };
            var container = $('.infographic__wrapper div', $modal);
            var graphWidth = container.width();
            var width = Math.round(graphWidth / 1.2) - margin.right - margin.left;
            var height = Math.round(graphWidth / 1.5) - margin.top - margin.bottom;

            var infographic = scope.modalIssue.issue.getInfographic();
            var languages = infographic.getDataPoints().commonLanguages;
            var graphData = [];

            var chart = controller._utilsService.simpleGroupedBarChart()
                .width(width)
                .height(height)
                .margin(margin)
                .colorArray(['#000', '#fff'])
                .fontColorArray(['#000', '#fff']);

            languages.forEach(function(d) {
                var lang = {
                    internet_content: d.data[0],
                    internet_population: d.data[1],
                    language: d.language
                };
                graphData.push(lang);
            });

            var selection = d3.select('.infographic__wrapper div', $modal);
            selection.datum(graphData).call(chart);

            // if there is a source for the infographic, add it.
            if (infographic._source.name) {
                controller._utilsService.addSource(infographic._source, container);
            }
        });
    };

    return ChartCommonLanguagesDirective;
});
