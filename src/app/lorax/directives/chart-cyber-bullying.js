/**
 * @fileOverview Cyber Bullying Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
  'use strict';

  /**
   * Cyber Bullying Chart directive
   */
  var ChartCyberBullyingDirective = function () {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: ChartCyberBullyingController,
      link: ChartCyberBullyingLinkFn
    };
  };

  /**
   * Controller for Cyber Bullying Chart directive
   * @constructor
   */
  var ChartCyberBullyingController = function (
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
  ChartCyberBullyingController.$inject = [
    '$scope',
    '$timeout'
  ];

  /**
   * Link function for Cyber Bullying Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartCyberBullyingLinkFn = function (scope, iElem, iAttrs, controller) {
    controller._$timeout(function() {
      var pieData = controller._$scope.issue.getInfographic().getDataPoints().cyberBullyingData.onlineHarassment.circleData;
      var lineData = controller._$scope.issue.getInfographic().getDataPoints().cyberBullyingData.socialNetwork.lineData;
      var imageChartData = controller._$scope.issue.getInfographic().getDataPoints().cyberBullyingData.cyberStalking;
      var id = controller._$scope.issue.getId();
      var cyberBullyingChart = d3.select('#' + id + ' .infographic__wrapper div');

      var graphWidth = $('#' + id + ' .infographic__wrapper div').width();

      drawLineChart();
      drawImageChart();
      drawPieChart();

      function drawLineChart() {
        var width = graphWidth*0.4;
        var height = graphWidth*0.45;
        var numDatasets = lineData[0].data.length;
        var margin = {top: 20, right: 20, bottom: 50, left: 10};

        var lineChart = cyberBullyingChart.append('div')
          .attr('class', 'cyberbullying__linechart');

        var title = lineChart.append('h3')
          .attr('class', 'cyberbullying__title')
          .text(controller._$scope.issue.getInfographic().getDataPoints().cyberBullyingData.socialNetwork.title);

        var lineSvg = lineChart.append('svg')
          .attr('class', 'cyberbullying__line-svg')
          .attr('width', width)
          .attr('height', height);

        drawPattern(lineSvg, margin, width, height);
        drawFirstAndLast(lineSvg, margin, width, height);

        var x = drawLabel(lineSvg, margin, width, height);

        for ( var i = 0; i < numDatasets; i++ ) {
          var y = d3.scale.linear()
          .range([height-margin.bottom, margin.top])
          .domain([80, 100]);

          var line = d3.svg.line()
            .x(function(d) { return x(d.label); })
            .y(function(d) { return y(d.data[i]); });

          var datasetGroup = lineSvg.append('g');

          datasetGroup.append('path')
            .datum(lineData)
            .attr('class', 'linegraph__line')
            .attr('d', line);

          var point = datasetGroup.selectAll('.point__' + i)
            .data(lineData)
            .enter()
            .append('g')
            .attr('class', function() { return 'linegraph__point_' + i; })
            .append('circle')
              .attr('class', function() { return 'linegraph__point_' + i + '_circle'})
              .attr('cx', function(d) { return x(d.label); })
              .attr('cy', function(d) { return y(+d.data[i]); })
              .attr('r', 3);
        }
      }


      function drawImageChart() {
        var imageChart = cyberBullyingChart.append('div')
          .attr('class', 'cyberbullying__imagechart');

        imageChart.append('h3')
          .attr('class', 'cyberbullying__title')
          .text(imageChartData.title);

        imageChart.append('img')
          .attr('src', imageChartData.imageUrl);

        imageChart.append('p')
          .text(imageChartData.copy);
      }

      function drawPieChart() {
        var width = graphWidth;
        var height = graphWidth * 0.6;
        var innerR = 0;
        var outerR = d3.scale.ordinal()
          .range([width*0.12, width*0.14, width*0.16, width*0.18, width*0.20, width*0.22, width*0.26]);

        var pieChart = cyberBullyingChart.append('div')
          .attr('class', 'cyberbullying__piechart');
        var title = pieChart.append('h3')
          .attr('class', 'cyberbullying__title')
          .text(controller._$scope.issue.getInfographic().getDataPoints().cyberBullyingData.onlineHarassment.title);

        var color = d3.scale.ordinal()
          .range(['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.4)']);

        drawLegend(pieChart, color);

        var pieSvg = pieChart.append('svg')
          .attr('class', 'cyberbullying__pie-svg')
          .attr('width', width)
          .attr('height', height)
          .style('margin-top', height*(-0.5));

        var group = pieSvg.append('g')
          .attr('class', 'cyberbullying__piechart')
          .attr('transform', 'translate(' + (width*0.70) + ',' + (height*0.4) + ')');

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
            var labelPos = [ 1.15, 1.2, 1.3, 1.5, 1.8, 2.2];
            var center = arc.centroid(d);
            var outside = [center[0]*labelPos[i], center[1]*labelPos[i]];
            return 'translate(' + outside + ')';
          })
          .text(function(d) { return d.value + '%'; });
      }


      function drawLegend(pieChart, color) {
        var legend = pieChart.append('div')
          .attr('class', 'cyberbullying__legend');

        for (var i = pieData.length-1; i >= 0 ; i--) {
          legend.append('div')
            .text(pieData[i].name)
            .style('border-left', '15px solid ' + color(pieData[i].value));
        }
      }

      function drawFirstAndLast(svg, margin, width, height) {
        var first = svg.append('g');

        first.append('text')
          .attr('class', 'linegraph__firstlast')
          .attr('x', margin.left)
          .attr('y', height - (height/2))
          .text( function() { return lineData[0].data[0] + '%';});

        var last = svg.append('g')
          .attr('class', 'linegraph__firstlast');

        last.append('text')
          .attr('class', 'linegraph__firstlast')
          .attr('x', width - margin.right*2)
          .attr('y', (height/2)+5)
          .text( function() { return lineData[lineData.length-1].data[0] + '%';});
      }

      function drawLabel(svg, margin, width, height) {
        var x = d3.scale.linear()
          .range([margin.left, width-margin.right])
          .domain([
            d3.min( lineData, function(d) { return d.label; }),
            d3.max( lineData, function(d) { return d.label; })
          ]);

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom')
          .tickFormat( function(d) { return d.toString(); })
          .tickValues( lineData.map( function (d) { return d.label; }) )
          .tickSize(0);

        svg.append('g')
          .attr('class', 'linegraph__xaxis_year')
          .attr('transform', 'translate(0,' + (height-margin.bottom) + ')')
          .call(xAxis);

          return x;
      }

      function drawPattern(svg, margin, width, height) {
        var x = d3.scale.linear()
          .range([margin.left, width-margin.right])
          .domain([
            d3.min( lineData, function(d) { return d.label; }),
            d3.max( lineData, function(d) { return d.label; })
          ]);

        var diff = Math.floor(Math.abs(x(lineData[0].label) - x(lineData[1].label)));

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

  return ChartCyberBullyingDirective;
});
