/**
 * @fileOverview Infrastructure Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
    'use strict';

    /**
     * Infrastructure Chart directive
     */
    var ChartInfrastructureDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ChartInfrastructureController,
            link: ChartInfrastructureLinkFn
        };
    };

    /**
     * Controller for Infrastructure Chart directive
     * @constructor
     */
    var ChartInfrastructureController = function (
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
    ChartInfrastructureController.$inject = [
        '$scope',
        '$timeout',
        'utilsService'
    ];

    /**
     * Link function for Infrastructure Chart directive
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      jQuery element.
     * @param {object} iAttrs     Directive attributes.
     * @param {object} controller Controller reference.
     */
    var ChartInfrastructureLinkFn = function (scope, iElem, iAttrs, controller) {
        controller._$timeout( function() {
            var infographic = scope.modalIssue.issue.getInfographic();
            var data = infographic.getDataPoints();
            var lineData = data.lineGraphData;

            var lineGraph = d3.select('#modal-issue .infographic__wrapper div');
            var numDatasets = lineData[0].data.length;

            var container = $('.infographic__wrapper div', $modal);
            var graphWidth = container.width();

            var mobileStyle = graphWidth < 420 ? true : false;
            var margin = {top: 20, right: 20, bottom: 50, left: 30};
            var width = graphWidth;
            var height = graphWidth*0.7;

            var svg = lineGraph.append('svg')
                .attr('class', 'linegraph__svg')
                .attr('width', width)
                .attr('height', height);

            drawPattern();
            drawLegend();
            drawData();

            function drawLegend() {
                var legend = svg.append('g')
                    .attr('class', 'linegraph__legend')
                    .attr('x', width-margin.right)
                    .attr('y', margin.top/3)
                    .attr('height', 100)
                    .attr('width', 300);

                legend.selectAll('g')
                    .data(data.dataLabels)
                    .enter()
                    .append('g')
                    .attr('class', 'linegraph__legendLabel');

                var legendLabel = legend.selectAll('.linegraph__legendLabel');

                legendLabel.selectAll('circle')
                    .data(data.dataLabels)
                    .enter()
                    .append('circle')
                    .attr('class', function(d, i) { return 'linegraph__point_' + i + '_circle';})
                    .attr('cx', function(d, i) {return width - margin.right - i*110 - (margin.right*5);})
                    .attr('cy', margin.top/3)
                    .attr('r', 3);

                legendLabel.selectAll('text')
                    .data(data.dataLabels)
                    .enter()
                    .append('text')
                    .attr('class', 'linegraph__legendtext')
                    .attr('x', function(d, i) {return width - margin.right - i*110 - (margin.right*5) + 6;})
                    .attr('y', margin.top/3+4)
                    .text(function(d) { return d; });
            }

            function drawLabel() {
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

            function drawData() {
                var x = drawLabel();

                for ( var i = 0; i < numDatasets; i++ ) {
                    var y = d3.scale.linear()
                        .range([height-margin.bottom, margin.top])
                        .domain([20,300]);

                    var line = d3.svg.line()
                        .x(function(d) { return x(d.label); })
                        .y(function(d) { return y(d.data[i]); });

                    var datasetGroup = svg.append('g');

                    datasetGroup.append('path')
                        .datum(lineData)
                        .attr('class', 'linegraph__line')
                        .attr('d', line);

                    datasetGroup.selectAll('.point__' + i)
                        .data(lineData)
                        .enter()
                        .append('g')
                        .attr('class', function() { return 'linegraph__point_' + i; })
                        .append('circle')
                        .attr('class', function() { return 'linegraph__point_' + i + '_circle'; })
                        .attr('cx', function(d) { return x(d.label); })
                        .attr('cy', function(d) { return y(+d.data[i]); })
                        .attr('r', 3);

                    if (mobileStyle) {
                        var xAxisScale = d3.scale.ordinal()
                            .domain(lineData.map( function(d, j) {
                                if (j%3 === 0) {
                                    return d.data[i].toString();
                                } else {
                                    return null;
                                }
                            }))
                            .rangePoints([margin.left, width-margin.right], 0.0);

                            // Get the extra value out of the array (annoying quirk of ordinal scale)
                            var nullIndex = xAxisScale.domain().indexOf(null);
                            if (nullIndex !== -1) {
                                xAxisScale.domain().splice(nullIndex,1);
                            }

                        var xAxisValue = d3.svg.axis()
                            .scale(xAxisScale)
                            .orient('bottom')
                            .tickSize(0);


                        var xAxisInfo = svg.append('g')
                            .attr('class', 'linegraph__xaxis_info')
                            .attr('transform', 'translate(0,' + (height - 30 +( i * 17)) + ')')
                            .call(xAxisValue);
                    } else {
                        var xAxisScale = d3.scale.ordinal()
                            .domain(lineData.map( function(d) { return d.data[i].toString(); }))
                            .rangePoints([margin.left, width-margin.right], 0.0);

                        var xAxisValue = d3.svg.axis()
                            .scale(xAxisScale)
                            .orient('bottom')
                            .tickSize(0);


                        var xAxisInfo = svg.append('g')
                            .attr('class', 'linegraph__xaxis_info')
                            .attr('transform', 'translate(0,' + (height - 30 +( i * 17)) + ')')
                            .call(xAxisValue);
                    }

                    xAxisInfo.append("circle")
                        .attr('class', 'linegraph__point_' + i + '_circle')
                        .attr('cx', 3)
                        .attr('cy', 7.5)
                        .attr('r', 3);
                }
            }

            function drawPattern() {
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

            // if there is a source for the infographic, add it.
            if (infographic._source.name) {
                controller._utilsService.addSource(infographic._source, container);
            }

        }.bind(controller));
    };

    return ChartInfrastructureDirective;
});
