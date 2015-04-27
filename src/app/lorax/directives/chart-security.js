/**
 * @fileOverview Security Chart directive
 * @author <a href='mailto:sneethling@mozilla.com'>Schalk Neethling</a>
 */
define(['jquery', 'd3'], function ($, d3) {
  'use strict';

  /**
   * Security Chart directive
   */
  var ChartSecurityDirective = function () {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: ChartSecurityController,
      link: ChartSecurityLinkFn
    };
  };

  /**
   * Controller for Security Chart directive
   * @constructor
   */
  var ChartSecurityController = function (
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
   ChartSecurityController.$inject = [
    '$scope',
    '$timeout',
    'utilsService'
  ];

  /**
   * Link function for Security Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartSecurityLinkFn = function (scope, iElem, iAttrs, controller) {
    controller._$timeout(function() {
      var infographic = scope.modalIssue.issue.getInfographic();
      var dataPoints = infographic.getDataPoints().security;

      var $modal =  $('#modal-issue');
      var circleChart = d3.select('.infographic__wrapper div', $modal);
      var $container = $('.infographic__wrapper div', $modal);

      var width = $container.width();
      var height = width;

      var config = {
          colorArray: ['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)'],
          dataPoints: dataPoints,
          labels: infographic.getLegendLabels(),
          circleChart: circleChart,
          width: width,
          height: height
      };

      controller._utilsService.circleChart(config);

      // if there is a source for the infographic, add it.
      if (infographic._source.name) {
          controller._utilsService.addSource(infographic._source, $container);
      }

    }.bind(controller));
  }

  return ChartSecurityDirective;
});
