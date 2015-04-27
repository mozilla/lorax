    /**
 * @fileOverview Concentration of Power Chart directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
    'use strict';

    /**
     * Concentration of Power Chart directive
     */
    var ChartConcentrationPowerDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ChartConcentrationPowerController,
            link: ChartConcentrationPowerLinkFn
        };
    };

    /**
     * Controller for Concentration of Power Chart directive
     * @constructor
     */
    var ChartConcentrationPowerController = function (
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
    ChartConcentrationPowerController.$inject = [
        '$scope',
        '$timeout',
        'utilsService'
    ];

    /**
     * Link function for Concentration of Power Chart directive
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      jQuery element.
     * @param {object} iAttrs     Directive attributes.
     * @param {object} controller Controller reference.
     */
    var ChartConcentrationPowerLinkFn = function (scope, iElem, iAttrs, controller) {
        controller._$timeout(function() {

          var $modal =  $('#modal-issue');

          var container = $('.infographic__wrapper div', $modal);
          var graphWidth = container.width();
          var width = Math.round(graphWidth / 1.2);
          var height = Math.round(graphWidth / 1.5);

          var infographic = scope.modalIssue.issue.getInfographic();
          var totalRevenue = infographic.getDataPoints().totalRevenue;
          var graphData = [];

          var chart = controller._utilsService.barChart()
            .margin({ top: 0, right: 30, bottom: 70, left: 70 })
            .width(width)
            .height(height)
            .yGrid(false);

          // transform the raw data into what the below function expects
          for (var i = 0, l = totalRevenue.length; i < l; i++) {
            graphData.push([totalRevenue[i].name, totalRevenue[i].amount]);
          }

          var selection = d3.select('.infographic__wrapper div', $modal);
          // draw the chart
          var chart = selection.datum(graphData).call(chart);

          // if there is a source for the infographic, add it.
          if (infographic._source.name) {
              controller._utilsService.addSource(infographic._source, container);
          }

        }.bind(controller));
    };

    return ChartConcentrationPowerDirective;
});
