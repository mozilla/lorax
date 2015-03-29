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
        $timeout
        )
    {
        this._$scope = $scope;
        this._$timeout = $timeout;


        var infographic = $scope.modalIssue.issue.getInfographic();
        $scope.lineGraph = {
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
        '$timeout'
    ];

  /**
   * Link function for Open Source Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartOpenSourceLinkFn = function (scope, iElem, iAttrs, controller) {
    controller._$timeout( function() {
      var data = controller._$scope.lineGraph.data;
      var lineData = data.lineGraphData;

      var lineGraph = d3.select('#modal-issue .infographic__wrapper div');

      var numDatasets = lineData[0].data.length;

      var graphWidth = $('#modal-issue .infographic__wrapper div').width();
      var mobileStyle = graphWidth < 420 ? true : false;

      var margin = {top: 20, right: 20, bottom: 50, left: 10};
      var width = graphWidth/2.25;
      var height = graphWidth/2.0;

      var svg = lineGraph.insert('svg', '.opensource__legend-os')
        .attr('class', 'opensource__svg')
        .attr('width', width)
        .attr('height', height);

      drawPattern();
      drawData();

      function drawLabel() {
        var x = d3.scale.linear()
          .range([margin.left, width-margin.right])
          .domain([
            d3.min( lineData, function(d) { return d.label; }),
            d3.max( lineData, function(d) { return d.label; })
          ]);

        var xAxis;
        if (mobileStyle) {
            xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .tickFormat( function(d, i) {
                if (i%2 === 0) {
                    return d.toString();
                }
                else {
                    return null;
                }
            })
            .tickValues( lineData.map( function (d, i) {
                if (i%2 === 0) {
                    return d.label;
                }
                else {
                    return null;
                }
            }))
            .tickSize(0);
        } else {
            xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .tickFormat( function(d) { return d.toString(); })
            .tickValues( lineData.map( function (d) { return d.label; }))
            .tickSize(0);
        }

        // filter out null values (d3 scales are terrible sometimes)
        for(var i = xAxis.tickValues.length-1; i--;){
            if (xAxis.tickValues[i] === null) {
                xAxis.tickValues.splice(i, 1);
            }
            if (xAxis.tickFormat[i] === null) {
                xAxis.tickFormat.splice(i, 1);
            }
        }

        svg.append('g')
          .attr('class', 'linegraph__xaxis_year')
          .attr('transform', 'translate(0,' + (height-margin.bottom+10) + ')')
          .call(xAxis);

          return x;
      }

      function drawData() {
        var x = drawLabel();

        for ( var i = 0; i < numDatasets; i++ ) {
          var y = d3.scale.linear()
          .range([height-margin.bottom, margin.top])
          .domain([0, 110]);

          var line = d3.svg.line()
            .x(function(d) { return x(d.label); })
            .y(function(d) { return y(d.data[i]); });

          var datasetGroup = svg.append('g')
            .attr('class', function() {
              if ( i < 3 ) {
                return 'opensource__dataset-os';
              }
              else {
                return 'opensource__dataset-browser';
              }
            });

          datasetGroup.append('path')
            .datum(lineData)
            .attr('class', 'linegraph__line opensource__line_' + i)
            .attr('d', line);

            switch (i) {
                case 0:
                case 3:
                    datasetGroup.selectAll('.point__' + i)
                        .data(lineData)
                        .enter()
                        .append('g')
                        .attr('class', 'opensource__point_' + i + ' opensource__point_circle')
                        .append('circle')
                          .attr('class', 'opensource__point_' + i + '_circle')
                          .attr('cx', function(d) { return x(d.label); })
                          .attr('cy', function(d) { return y(+d.data[i]); })
                          .attr('r', 3);
                    break;

                case 1:
                case 4:
                    datasetGroup.selectAll('.point__' + i)
                        .data(lineData)
                        .enter()
                        .append('g')
                        .attr('class', 'opensource__point_' + i + ' opensource__point_square')
                        .append('rect')
                          .attr('class', 'opensource__point_' + i + '_circle')
                          .attr('x', function(d) { return x(d.label) - 3; })
                          .attr('y', function(d) { return y(+d.data[i]) - 3; })
                          .attr('width', 6)
                          .attr('height', 6);
                    break;

                case 2:
                case 5:
                    datasetGroup.selectAll('.point__' + i)
                        .data(lineData)
                        .enter()
                        .append('g')
                        .attr('class', 'opensource__point_' + i + ' opensource__point_triangle')
                        .append('polygon')
                          .attr('class', 'opensource__point_' + i + '_circle')
                          .attr('points', function(d) {
                            var p1 = x(d.label) + ',' + (y(+d.data[i])-4);
                            var p2 = (x(d.label)+4) + ',' + (y(+d.data[i])+4);
                            var p3 = (x(d.label)-4) + ',' + (y(+d.data[i])+4);
                            var points = [p1, p2, p3];
                            return points.join(' ');
                          });
                    break;

            }
        }
      }

      function drawPattern() {
        var x = d3.scale.linear()
          .range([margin.left, width-margin.right])
          .domain([
            d3.min( lineData, function(d) { return d.label; }),
            d3.max( lineData, function(d) { return d.label; })
          ]);

        var diff = Math.floor(Math.abs(x(lineData[0].label) - x(lineData[1].label)))/2;

        var pattern = svg.append('g')
          .attr('class', 'linegraph__pattern');

        var years = lineData.map( function(d) { return d.label; });
        years.forEach( function(val) {

          for ( var i = margin.top+15; i < height-margin.bottom; i+=diff ) {
            var xPos = x(val);
            pattern.append('line')
              .attr('x1', xPos+2.5)
              .attr('y1', i)
              .attr('x2', xPos+2.5)
              .attr('y2', i+5);

            pattern.append('line')
              .attr('x1', xPos)
              .attr('y1', i+2.5)
              .attr('x2', xPos+5)
              .attr('y2', i+2.5);
          }
        });
      }


    }.bind(controller));
  };

    return ChartOpenSourceDirective;
});
