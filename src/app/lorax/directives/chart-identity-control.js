/**
 * @fileOverview Identity Control Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 * @author <a href='mailto:sneethling@mozilla.com'>Schalk Neethling</a>
 */
define(['jquery', 'd3'], function ($, d3) {
  'use strict';

  /**
   * Identity Control Chart directive
   */
  var ChartIdentityControlDirective = function () {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: ChartIdentityControlController,
      link: ChartIdentityControlLinkFn
    };
  };

  /**
   * Controller for Identity Control Chart directive
   * @constructor
   */
  var ChartIdentityControlController = function (
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
  ChartIdentityControlController.$inject = [
    '$scope',
    '$timeout',
    'utilsService'
  ];

  /**
   * Link function for Identity Control Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartIdentityControlLinkFn = function (scope, iElem, iAttrs, controller) {
    controller._$timeout(function() {

      var $modal =  $('#modal-issue');

      var container = $('.infographic__wrapper div', $modal);
      var graphWidth = container.width();

      var width = Math.round(graphWidth / 1.5);
      var height = Math.round(graphWidth / 1.5);

      var infographic = scope.modalIssue.issue.getInfographic();
      var marketShare = infographic.getDataPoints().marketShare;
      var graphData = [];

      var chart = controller._utilsService.columnChart()
        .margin({ top: 0, right: 30, bottom: 70, left: 40 })
        .width(width)
        .height(height)
        .yAxisFormat(d3.format("%"))
        .xGrid(true);

      // transform the raw data into what the below function expects
      for (var i = 0, l = marketShare.length; i < l; i++) {
        graphData.push([marketShare[i].company, marketShare[i].value]);
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

  return ChartIdentityControlDirective;
});
