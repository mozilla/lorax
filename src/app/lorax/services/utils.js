/**
 * Utility functions
 *
 * @class lorax/services/utilsService
 */
define(function () {
    'use strict';

    var utilsService = function () {

        /**
         * @method core/services/utilsService~getURLParameter
         * @param name {String} name of parameter
         */
        function getURLParameter(name) {
            return decodeURIComponent((
                new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [,''])[1]
                    .replace(/\+/g, '%20'
            )) || null;
        }

        /**
         * Based Mike Bostock's reusable chart code, this makes adding simple bar
         * chart anywhere in Lorax simple.
         */
        function barChart() {

            var yAxisFormat;
            var xGrid = true;
            var yGrid = true;
            var margin = { top: 20, right: 30, bottom: 30, left: 40 };

            var width = 960;
            var height = 500;

            function chart(selection) {

                var innerWidth = width - margin.left - margin.right;
                var innerHeight = height - margin.top - margin.bottom;

                var x = d3.scale.ordinal().rangeRoundBands([0, innerWidth], .1);
                var y = d3.scale.linear().range([innerHeight, 0]);

                var xAxis = d3.svg.axis().scale(x).orient('bottom');
                var yAxis = d3.svg.axis().scale(y).orient('left');

                // if a format was specified, apply
                if (yAxisFormat) {
                    yAxis.tickFormat(yAxisFormat);
                }

                selection.each(function(data) {
                    x.domain(data.map(function(d) { return d[0] }));
                    y.domain([0, d3.max(data, function(d) { return d[1]; })]);

                    var svg = d3.select(this).append('svg')
                       .attr('width', width)
                       .attr('height', height)
                     .append('g')
                       .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                    var gridConfig = {
                        svg: svg,
                        innerWidth: innerWidth,
                        innerHeight: innerHeight,
                        xGrid: xGrid,
                        yGrid: yGrid
                    };

                    svg.append('g')
                        .attr('class', 'x axis')
                        .attr('transform', 'translate(0,' + innerHeight + ')')
                        .call(xAxis);

                    d3.select('.x')
                      .selectAll('.tick text')
                      .attr('y', '5')
                      .attr('x', '-60');

                    svg.append('g')
                        .attr('class', 'y axis')
                        .call(yAxis);

                    if (xGrid) {
                        svg.append('g')
                            .attr('class', 'grid')
                            .attr('transform', 'translate(0,' + innerHeight + ')')
                            .style('opacity', '0.1')
                            .call(xAxis.tickSize(-innerHeight, 0, 0)
                                .tickFormat(''));
                    }

                    if(yGrid) {
                        svg.append('g')
                            .attr('class', 'grid')
                            .style('opacity', '0.1')
                            .call(yAxis.tickSize(-innerWidth, 0, 0)
                                .tickFormat(''));
                    }

                    svg.selectAll('.bar')
                        .data(data)
                      .enter().append('rect')
                        .attr('class', 'bar')
                        .attr('x', function(d) { return x(d[0]); })
                        .attr('y', function(d) { return y(d[1]); })
                        .attr('height', function(d) { return innerHeight - y(d[1]); })
                        .attr('width', x.rangeBand());
                });
            }

            chart.yAxisFormat = function(value) {
                if (!arguments.length) return yAxisFormat;
                yAxisFormat = value;
                return chart;
            }

            chart.yGrid = function(value) {
                if (!arguments.length) return yGrid;
                yGrid = value;
                return chart;
            }

            chart.xGrid = function(value) {
                if (!arguments.length) return xGrid;
                xGrid = value;
                return chart;
            }

            chart.margin = function(value) {
                if (!arguments.length) return margin;
                margin = value;
                return chart;
            }

            chart.width = function(value) {
                if (!arguments.length) return width;
                width = value;
                return chart;
            }

            chart.height = function(value) {
                if (!arguments.length) return height;
                height = value;
                return chart;
            }

            return chart;
        }

        return {
            barChart: barChart,
            getURLParameter: getURLParameter
        };
    };

    return utilsService;
});
