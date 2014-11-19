/**
 * @fileOverview Identity Control Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
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
      var pieChart = d3.select('#' + id + ' .infographic__wrapper div');

      var graphWidth = $('#' + id + ' .infographic__wrapper div').width();
      var width = graphWidth;
      var height = graphWidth;

      var innerR = 0;
      var outerR = d3.scale.ordinal()
        .range([width*0.16, width*0.18, width*0.20, width*0.22, width*0.24, width*0.26, width*0.30]);


      var color = d3.scale.ordinal()
        .range(['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.4)', 'rgba(255,255,255,0.5)']);

      drawLegend();

      var svg = pieChart.append('svg')
        .attr('class', 'identity__svg')
        .attr('width', width)
        .attr('height', height);

      var group = svg.append('g')
        .attr('class', 'identity__piechart')
        .attr('transform', 'translate(' + (width*0.6) + ',' + (height*0.3) + ')');

      var arc = d3.svg.arc()
        .innerRadius(innerR)
        .outerRadius(outerR);

      var pie = d3.layout.pie()
        .value(function(d) { return d.value; })
        .sort(null);

      var arcs = group.selectAll('.arc')
        .data(pie(pieData))
        .enter()
        .append('g')
          .attr('class', 'arc');

      arcs.append('path')
        .attr('d', d3.svg.arc().innerRadius(innerR).outerRadius(function(d) { return outerR(d.value); }))
        .attr('fill', function(d) { return color(d.value); });

      arcs.append('text')
        .attr('class', 'identity__label-text')
        .attr('transform', function(d, i) {
          var labelPos = [ 2.4, 2.6, 2.8, 3.1, 3.3, 3.7, 4.55 ];
          var center = arc.centroid(d);
          var outside = [center[0]*labelPos[i], center[1]*labelPos[i]];
          return 'translate(' + outside + ')';
        })
        .text(function(d) { return d.value + '%'; });

      function drawLegend() {
        var legend = pieChart.append('div')
          .attr('class', 'identity__legend');

        for (var i = pieData.length-1; i >= 0 ; i--) {
          legend.append('div')
            .text(pieData[i].company)
            .style('border-left', '15px solid ' + color(pieData[i].value));
        }
      }

    }.bind(controller));
  };

  return ChartIdentityControlDirective;
});
