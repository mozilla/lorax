/**
 * @fileOverview Intellectual Property Chart directive
 * @author <a href='mailto:sneethling@mozilla.com'>Schalk Neethling</a>
 */
define(['jquery', 'd3'], function ($, d3) {
    'use strict';

    /**
     * Intellectual Property Chart directive
     */
    var ChartIntellectualPropertyDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ChartIntellectualPropertyController,
            link: ChartIntellectualPropertyLinkFn
        };
    };

    /**
     * Controller for Intellectual Property directive
     * @constructor
     */
    var ChartIntellectualPropertyController = function (
        $scope,
        $timeout
        )
    {
        this._$scope = $scope;
        this._$timeout = $timeout;
    };

    ChartIntellectualPropertyController.prototype.drawLine = function(options) {

        for (var i = 0, l = options.numDatasets; i < l; i++) {

            var x = d3.scale.linear()
                .range([options.margins.left, options.width - options.margins.right])
                .domain([
                    d3.min(options.data, function(d) { return d.label; }),
                    d3.max(options.data, function(d) { return d.label; })
                ]);

            var y = d3.scale.linear()
                .range([options.height - options.margins.bottom, options.margins.top])
                .domain([0, 6500]);

            var line = d3.svg.line()
                .x(function(d) { return x(d.label); })
                .y(function(d) { return y(d.data[i]); });

            var datasetGroup = options.svg.append('g')
                .attr('transform', 'translate(' + -options.margins.left + ', 0)');

            datasetGroup.append('path')
                .datum(options.data)
                .attr('class', 'linegraph__line')
                .attr('d', line);

            datasetGroup.selectAll('.point__' + i)
                .data(options.data)
                .enter()
                .append('g')
                .attr('class', function() { return 'linegraph__point_' + i; })
                .append('circle')
                    .attr('class', function() { return 'linegraph__point_' + i + '_circle'; })
                    .attr('cx', function(d) { return x(d.label) })
                    .attr('cy', function(d) { return y(+d.data[i]); })
                    .attr('r', 3);
        }
    };

    /**
     * Draws the xAxis off the graph and optionally the associated grid lines.
     */
    ChartIntellectualPropertyController.prototype.xAxis = function(options) {
        var x = d3.scale.linear()
            .domain([d3.min(options.labels), d3.max(options.labels)])
            .range([0, options.innerWidth]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .tickFormat(d3.format("d"));

        if (options.axis) {
            options.svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + options.innerHeight + ')')
                .call(xAxis);

            d3.select('.x')
              .selectAll('.tick text')
              .attr('y', '5')
              .attr('x', '-20');
        }

        if (options.grid) {
            options.svg.append('g')
                .attr('class', 'grid')
                .attr('transform', 'translate(0,' + options.innerHeight + ')')
                .style('opacity', '0.1')
                .call(xAxis.tickSize(-options.innerHeight, 0, 0)
                    .tickFormat(''));
        }

         return options.svg;
    };

    /**
     * Draws the yAxis off the graph and optionally the associated grid lines.
     */
    ChartIntellectualPropertyController.prototype.yAxis = function(options) {
        var y = d3.scale.linear()
            .domain([d3.min(options.values), d3.max(options.values)])
            .range([options.innerHeight, 0]);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .tickFormat(d3.format("d"));

        if (options.axis) {
            options.svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis);
        }

        if(options.grid) {
            options.svg.append('g')
                .attr('class', 'grid')
                .style('opacity', '0.1')
                .call(yAxis.tickSize(-options.innerWidth, 0, 0)
                    .tickFormat(''));
        }

        return options.svg;
    };


    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
     ChartIntellectualPropertyController.$inject = [
        '$scope',
        '$timeout'
    ];

    /**
     * Link function for Intellectual Property Chart directive
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      jQuery element.
     * @param {object} iAttrs     Directive attributes.
     * @param {object} controller Controller reference.
     */
    var ChartIntellectualPropertyLinkFn = function (scope, iElem, iAttrs, controller) {
        controller._$timeout(function() {
            var infographic = scope.modalIssue.issue.getInfographic();
            var data = infographic.getDataPoints();

            var lineData = data.lineGraphData;
            var labels = data.labels;
            var values = data.values;

            var modal = $('#modal-issue');
            var ipGraph = d3.select('.infographic__wrapper div', modal);
            var margin = { top: 20, right: 30, bottom: 30, left: 40 };

            var width = $('.infographic__wrapper div', modal).width();
            var height = width;

            var innerWidth = width - margin.left - margin.right;
            var innerHeight = height - margin.top - margin.bottom;

            var svg = ipGraph.append('svg')
                .attr('width', width)
                .attr('height', height)
              .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var xAxisOptions = {
                grid: true,
                axis: true,
                svg: svg,
                labels: labels,
                innerWidth: innerWidth,
                innerHeight: innerHeight
            };
            svg = controller.xAxis(xAxisOptions);

            var yAxisOptions = {
                grid: true,
                axis: true,
                svg: svg,
                values: values,
                innerWidth: innerWidth,
                innerHeight: innerHeight
            };
            svg = controller.yAxis(yAxisOptions);

            var options = {
                svg: svg,
                margins: margin,
                width: width,
                height: height,
                data: lineData,
                numDatasets: lineData[0].data.length
            };
            controller.drawLine(options);
        });
    }
    return ChartIntellectualPropertyDirective;
});
