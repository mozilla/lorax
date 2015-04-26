/**
 * @fileOverview Platform Neutrality Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
  'use strict';

  /**
   * Platform Neutrality Chart directive
   */
  var ChartPlatformNeutralityDirective = function () {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: ChartPlatformNeutralityController,
      link: ChartPlatformNeutralityLinkFn
    };
  };

  /**
   * Controller for Platform Neutrality Chart directive
   * @constructor
   */
  var ChartPlatformNeutralityController = function (
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
  ChartPlatformNeutralityController.$inject = [
    '$scope',
    '$timeout',
    'utilsService'
  ];

  /**
   * Link function for Platform Neutrality Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartPlatformNeutralityLinkFn = function (scope, iElem, iAttrs, controller) {
    controller._$timeout(function() {

      var $modal =  $('#modal-issue');

      var container = $('.infographic__wrapper div', $modal);
      var graphWidth = container.width();

      var width = Math.round(graphWidth / 1.5);
      var height = Math.round(graphWidth / 1.5);

      var infographic = scope.modalIssue.issue.getInfographic();
      var percentUsers = infographic.getDataPoints().percentOfUsers;
      var graphData = [];

      var chart = controller._utilsService.barChart()
        .margin({ top: 0, right: 30, bottom: 100, left: 70 })
        .width(width)
        .height(height)
        .yAxisFormat(d3.format("%"))
        .yGrid(false);

      // transform the raw data into what the below function expects
      for (var i = 0, l = percentUsers.length; i < l; i++) {
        graphData.push([percentUsers[i].type, percentUsers[i].value]);
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

  return ChartPlatformNeutralityDirective;
});
