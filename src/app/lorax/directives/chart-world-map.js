/**
 * @fileOverview Terms & Conditions Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 */
define(['jquery', 'd3', 'topojson'], function ($, d3, topojson) {
    'use strict';

    /**
     * Terms & Conditions Chart directive
     */
    var ChartWorldMapDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ChartWorldMapController,
            link: ChartWorldMapLinkFn
        };
    };

    /**
     * Controller for Terms & Conditions Chart directive
     * @constructor
     */
    var ChartWorldMapController = function (
        $scope,
        $timeout,
        dataService
        )
    {
        this._$scope = $scope;
        this._$timeout = $timeout;
        this._getMap = dataService.getMap();
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
    ChartWorldMapController.$inject = [
        '$scope',
        '$timeout',
        'dataService'
    ];

    /**
     * Link function for Terms and Conditions Chart directive
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      jQuery element.
     * @param {object} iAttrs     Directive attributes.
     * @param {object} controller Controller reference.
     */
    var ChartWorldMapLinkFn = function (scope, iElem, iAttrs, controller) {
        controller._getMap.then(function (model) {
            var countryColors = [
                '#305323',
                '#3b672c',
                '#2d4c20',
                '#457833'
            ]

            var mapData = model;

            var infographicData = controller._$scope.issue.getInfographic().getDataPoints().countries;
            var countryData = {};
            $.each(infographicData, function(key, data) {
                var id = data.id;
                var value = data.value;
                var display = data.displayName;

                countryData[id] = {
                    'display': display,
                    'value': value
                }
            });

            var map = d3.select('#' + controller._$scope.issue.getId() + ' .infographic__wrapper div')
                .attr('class', 'map');
            var mapWidth = $('#' + controller._$scope.issue.getId() + ' .infographic__wrapper div').width();
            var width = 938;
            var height = 500;

            var projection = d3.geo.mercator()
                    .scale(110)
                    .translate([width / 2, height / 1.5]);

            var path = d3.geo.path()
                .projection(projection);

            var svg = map.append('svg')
                .attr('preserveAspectRatio', 'xMidYMid')
                .attr('viewBox', '0 0 ' + width + ' ' + height)
                .attr('width', mapWidth)
                .attr('height', mapWidth * height / width);

            svg.append('rect')
                .attr('class', 'map__background')
                .attr('width', width)
                .attr('height', height)
                .on('click', country_clicked);

            var g = svg.append('g');

            g.append('g')
                .attr('id', 'countries')
                .selectAll('path')
                .data(topojson.feature(mapData, mapData.objects.countries).features)
                .enter()
                .append('path')
                .attr('id', function getId(d) { return controller._$scope.issue.getId() + '_' + d.id; })
                .attr('fill', function getCountryColor() { return countryColors[Math.floor((Math.random() * countryColors.length))];})
                .attr('d', path)
                // .style('filter', 'url(#patternFilter)')
                //.style('mask', 'url(#maskStripe)')
                //.style('pattern', 'url(#patternStripe)')
                .on('click', country_clicked);

            initializeSvgFilters(svg);

            function country_clicked (d) {
                g.selectAll('path').style('filter', '');
                if (d) {
                    var country = g.select('#' + controller._$scope.issue.getId() + '_' + d.id);
                    if ( countryData[d.id] ) {
                        country.style('filter', 'url(#offsetFilter)');
                    }
                }
            }
        }.bind(controller));
    };

    function initializeSvgFilters(svg) {
        var defs = svg.append('defs');

        var offsetFilter = defs.append('filter')
                .attr('id', 'offsetFilter')
                .attr('height', '130%');

        var bright = offsetFilter.append('feComponentTransfer');
                bright.attr('in', 'SourceGraphic')
                bright.append('feFuncR')
                    .attr('type', 'linear')
                    .attr('slope', 9999)
                bright.append('feFuncG')
                    .attr('type', 'linear')
                    .attr('slope', '10')
                bright.append('feFuncB')
                    .attr('type', 'linear')
                    .attr('slope', '10')
                bright.attr('result', 'brightness');

        offsetFilter.append('feColorMatrix')
                .attr('in', 'brightness')
                .attr('type', 'saturate')
                .attr('values', 0)
                .attr('result', 'desaturate');

        offsetFilter.append('feOffset')
                .attr('in', 'desaturate')
                .attr('dx', -2)
                .attr('dy', -2)
                .attr('result', 'offset');

        var feOffsetMerge = offsetFilter.append('feMerge');
        feOffsetMerge.append('feMergeNode')
                .attr('in', 'SourceGraphic');
        feOffsetMerge.append('feMergeNode')
                .attr('in', 'offset');




        // var patternFilter = defs.append('filter')
        //     .attr('id', 'patternFilter')
        //     .attr('filterUnits', 'objectBoundingBox');


        // patternFilter.append('feImage')
        //     .attr('xlink:href', '../img/stripes_small.png')
        //     .attr('width', 2)
        //     .attr('height', 2)
        //     .attr('result', 'stripes');

        // patternFilter.append('feTile')
        //     .attr('in', 'stripes')
        //     .attr('result', 'stripes');

        // patternFilter.append('feComposite')
        //     .attr('in', 'stripes')
        //     .attr('in2', 'SourceGraphic')
        //     .attr('operator', 'in')
        //     .attr('result', 'stripePattern');

        // var fePatternMerge = patternFilter.append('feMerge');
        // fePatternMerge.append('feMergeNode')
        //     .attr('in', 'SourceGraphic');
        // fePatternMerge.append('feMergeNode')
        //     .attr('in', 'stripePattern');
    }

    return ChartWorldMapDirective;
});
