/**
 * @fileOverview Line Graph Chart directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
  'use strict';

  /**
   * Line Graph Chart directive
   */
  var ChartLineGraphDirective = function () {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: ChartLineGraphController,
      link: ChartLineGraphLinkFn
    };
  };

  /**
   * Controller for Terms & Conditions Chart directive
   * @constructor
   */
  var ChartLineGraphController = function (
    $scope,
    $timeout
    )
  {
    this._$scope = $scope;
    this._$timeout = $timeout;
  };

  /**
   * Array of dependencies to be injected into controller
   * @type {Array}
   */
  ChartLineGraphController.$inject = [
    '$scope',
    '$timeout'
  ];

  /**
   * Link function for Line Graph Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartLineGraphLinkFn = function (scope, iElem, iAttrs, controller) {
    controller._$timeout(function () {
      var id = controller._$scope.issue.getId();
      var data = controller._$scope.issue.getInfographic().getDataPoints().lineGraphData;
      var chart = d3.select("#" + id + " .infographic__wrapper div");
            
      var svg = chart.append("svg")
        .attr("class", id + "_svg")
        .attr("width", 1000)
        .attr("height", 500);

      var width = 1000;
      var height = 500;
      var margins = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
          };


      var xAxis = chart.selectAll('div')
        .data(data)
        .enter()
        .append("div")
          .attr("class", id + "_xAxis")
          .attr("label", function(d, i) { return d.label; });

      var points = xAxis.selectAll("rect")
        .data( function(d) { return d; })
        .enter()
        .append("rect")
          .attr("value", function(d, i) { return d[i] });
    }.bind(controller));
  };

  return ChartLineGraphDirective;
});
