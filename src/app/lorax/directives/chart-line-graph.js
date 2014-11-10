/**
 * @fileOverview Line Graph Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
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
    controller._$timeout( function() {
      var lineData = controller._$scope.issue.getInfographic().getDataPoints().lineGraphData;
      var id = controller._$scope.issue.getId();
      var lineGraph = d3.select("#" + id + " .infographic__wrapper div");
      var numDatasets = lineData[0].data.length;

      var graphWidth = $("#" + id + " .infographic__wrapper div").width();

      lineData.forEach(function(d) {
        d.data[0] = d.data[0].replace(/,/g, '');
      });

      var margin = {top: 20, right: 20, bottom: 50, left: 50};
      var width = graphWidth;
      var height = graphWidth * .7;

      var svg = lineGraph.append("svg")
        .attr("class", "lineGraphSVG")
        .attr("width", width)
        .attr("height", height);

      drawData();      



      function drawLabel() {
        var x = d3.scale.linear()
          .range([margin.left, width-margin.right])
          .domain([
            d3.min( lineData, function(d) { return d.label }),
            d3.max( lineData, function(d) { return d.label })
          ]);

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickFormat( function(d) { return d.toString(); })
          .tickValues( lineData.map( function (d) { return d.label; }) )
          .tickSize(0);

        svg.append("g")
          .attr("class", "linegraph__xaxis_year")
          .attr("transform", "translate(0," + (height-70) + ")")
          .call(xAxis);

          return x;
      }

      function drawData() {
        var x = drawLabel();

        for ( var i = 0; i < numDatasets; i++ ) {
          var y = d3.scale.linear()
          .range([height-margin.top, -margin.bottom])
          .domain([
            d3.min( lineData, function(d) { return (d.data[i] * 0.50); }) - margin.bottom,
            d3.max( lineData, function(d) { return (d.data[i] * 1.25); }) - margin.top
          ]);

          var line = d3.svg.line()    
            .x(function(d) { return x(d.label); })
            .y(function(d) { return y(d.data[i]) });    

          svg.append("path")
            .datum(lineData)
            .attr("class", "linegraph__line")
            .attr("d", line);

          var point = svg.selectAll(".point__" + i)
            .data(lineData)
            .enter()
            .append("g")
            .attr("class", function() { return "linegraph__point_" + i; })
            .append("circle")
              .attr("class", function() { return "linegraph__point_" + i + "_circle"})
              .attr("cx", function(d) { return x(d.label); })
              .attr("cy", function(d) { return y(+d.data[i]); })
              .attr("r", 3);


          if ( i === 0 ) {
            var xAxisScale = d3.scale.ordinal()
              .domain(lineData.map( function(d) { return d.data[i].toString().slice(0,-6); }))
              .rangePoints([margin.left, width-margin.right], 0.0);  
            }
          else {
            var xAxisScale = d3.scale.ordinal()
              .domain(lineData.map( function(d) { return d.data[i].toString(); }))
              .rangePoints([margin.left, width-margin.right], 0.0);  
          }
        
          var xAxisValue = d3.svg.axis()
            .scale(xAxisScale)
            .orient("bottom")
            .tickSize(0);

          svg.append("g")
            .attr("class", "linegraph__xaxis_info")
            .attr("transform", "translate(0," + (height - 45 +( i * 20)) + ")")
            .call(xAxisValue);
        }
      }      


    }.bind(controller));
  };
  
    return ChartLineGraphDirective;
});
