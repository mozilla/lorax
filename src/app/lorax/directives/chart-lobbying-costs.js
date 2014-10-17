/**
 * @fileOverview Lobbying Costs Chart directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
  'use strict';

  /**
   * Lobbying Costs Chart directive
   */
  var ChartLobbyingCostsDirective = function () {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: ChartLobbyingCostsController,
      link: ChartLobbyingCostsLinkFn
    };
  };

  /**
   * Controller for Lobbying Costs Chart directive
   * @constructor
   */
  var ChartLobbyingCostsController = function (
    $scope
    )
  {
    this._$scope = $scope;
  };

  /**
   * Array of dependencies to be injected into controller
   * @type {Array}
   */
  ChartLobbyingCostsController.$inject = [
    '$scope'
  ];

  /**
   * Link function for Lobbying Costs Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartLobbyingCostsLinkFn = function () {
    console.log(d3);
    /*
    var margin = {top: 48, right: 12, bottom: 88, left: 24};
    var width = 600 - margin.left - margin.right;
    var height = 540 - margin.top - margin.bottom;

    var x = d3.scale.linear()
      .range([0, width]);

    var y = d3.scale.linear()
      .range([height, 0]);

    //var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    var line = d3.svg.line()
      .interpolate('basis')
      .x(function (d) { return x(d.year); })
      .y(function (d) { return y(d.revolvers); });

    var svg = d3.select('.lobbying-costs').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    d3.json('/scripts/data/lobbying-costs.json', function (error, res) {
      var data = res.lobbyingCosts;

      var varNames = d3.keys(data[0])
        .filter(function (key) { console.log(key) });



      var lobbying = chart.selectAll('g')
        .data(data)
        .enter()
        .append('g');

      lobbying.append('td')
        .text(function (d) {
          //return d.spoken.pct + '%';
        });
    });
    */
  };

  return ChartLobbyingCostsDirective;
});
