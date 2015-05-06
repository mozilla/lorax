/**
 * @fileOverview Open Source Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
    'use strict';

    /**
     * Open Source Chart directive
     */
    var ChartOpenSourceDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ChartOpenSourceController,
            link: ChartOpenSourceLinkFn,
            templateUrl: '/app/lorax/directives/chart-open-source.tpl.html'
        };
    };

    /**
     * Controller for Open Source Chart directive
     * @constructor
     */
    var ChartOpenSourceController = function (
        $scope,
        $timeout,
        utilsService
        )
    {
        this._$scope = $scope;
        this._$timeout = $timeout;
        this._utilsService = utilsService;


        var infographic = $scope.modalIssue.issue.getInfographic();
        $scope.lineGraph = {
          infographic: infographic,
          data: infographic.getDataPoints(),
          dataLabels: infographic.getDataPoints().dataLabels
        };
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    ChartOpenSourceController.$inject = [
        '$scope',
        '$timeout',
        'utilsService'
    ];

  /**
   * Link function for Open Source Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartOpenSourceLinkFn = function (scope, iElem, iAttrs, controller) {
    controller._$timeout(function() {
      var data = controller._$scope.lineGraph.data;
      var lineData = data.lineGraphData;

      var $modal = $('#modal-issue');
      var lineGraph = d3.select('.infographic__wrapper div', $modal);

      var $container = $('.infographic__wrapper div', $modal);
      var graphDimension = $container.width();

      var margin = { top: 20, right: 90, bottom: 30, left: 40 };
      var chart = this._utilsService.multiSeriesLineChart()
          .margin(margin)
          .width(graphDimension - margin.left - margin.right)
          .height((graphDimension / 1.6) - margin.top - margin.bottom);

      d3.select('.chart', $modal)
          .datum(lineData)
          .call(chart);

    }.bind(controller));
  };

    return ChartOpenSourceDirective;
});
