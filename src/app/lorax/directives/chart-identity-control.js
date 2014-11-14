/**
 * @fileOverview Identity Control Chart directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
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
  ChartIdentityControlController.$inject = [
    '$scope',
    '$timeout'
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
      var pieData = controller._$scope.issue.getInfographic().getDataPoints().marketShare;
      var id = controller._$scope.issue.getId();
      var pieChart = d3.select("#" + id + " .infographic__wrapper div");

      var graphWidth = $("#" + id + " .infographic__wrapper div").width();
      var width = graphWidth;
      var height = graphWidth * .4;

      var innerR = 72;
      var outerR = 80;
      var spacing = 200;
      
      var svg = pieChart.append("svg")
        .attr("id", "platformneutrality__svg")
        .attr("width", width)
        .attr("height", height);
        
      var pie = d3.layout.pie(pieData.map( function(d) { return d.value; }))
        .sort(null);

      var g = svg.selectAll(".arc")
        .data(pie)
        .enter()
        .append("g")
          .attr("class", "arc");

      g.append("path")
        .attr("d", arc);

    }.bind(controller));

  }

  return ChartIdentityControlDirective;
});
