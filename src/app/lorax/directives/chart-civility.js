/**
 * @fileOverview Civility Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
    'use strict';

    /**
     * Civility Chart directive
     */
    var ChartCivilityDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ChartCivilityController,
            link: ChartCivilityLinkFn
        };
    };

    /**
    * Controller for Civility Chart directive
    * @constructor
    */
    var ChartCivilityController = function (
        $scope,
        $timeout,
        utilsService
    ) {
        this._$scope = $scope;
        this._$timeout = $timeout;
        this._utilsService = utilsService;
    };

    /**
     * Array of dependencies to be injected into controller
     * @type {Array}
     */
     ChartCivilityController.$inject = [
        '$scope',
        '$timeout',
        'utilsService'
    ];

    /**
     * Link function for Cyber Bullying Chart directive
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      jQuery element.
     * @param {object} iAttrs     Directive attributes.
     * @param {object} controller Controller reference.
     */
    var ChartCivilityLinkFn = function (scope, iElem, iAttrs, controller) {
        controller._$timeout(function() {
            var infographic = scope.modalIssue.issue.getInfographic();

            var socialNetworkData = infographic.getDataPoints().civility.socialNetwork;
            var cyberStalkingData = infographic.getDataPoints().civility.cyberStalking;
            var onlineHarassmentData = infographic.getDataPoints().civility.onlineHarassment;

            var socialNetworkTitle = infographic.getDataPoints().civility.socialNetwork.title;
            var harassmentTitle = infographic.getDataPoints().civility.onlineHarassment.title;

            var $modal = $('#modal-issue');
            var cyberBullyingChart = d3.select('.infographic__wrapper div', $modal);

            var $container = $('.infographic__wrapper div', $modal);
            var graphWidth = $container.width();

            socialNetwork();
            cyberStalking();
            onlineHarassment();

            /**
             * Draws the social networks line chart.
             */
            function socialNetwork() {
                var margin = { top: 20, right: 30, bottom: 70, left: 40 };
                var selection = d3.select('.infographic__wrapper div');

                var socialNetworkContainer = selection.append('div')
                    .attr('class', 'social-networks');

                var chart = controller._utilsService.lineChart()
                   .width(300 - margin.left - margin.right)
                   .height(300 - margin.top - margin.bottom);

                socialNetworkContainer.datum(socialNetworkData.lineGraphData).call(chart);

                var $chart = $('.line-chart', $container);
                var $title = $('<h3 />', {
                    text: socialNetworkData.title
                });
                $title.insertBefore($chart);
            }

            function cyberStalking() {
                var imageChart = cyberBullyingChart.append('div')
                    .attr('class', 'cyberbullying-imagechart');

                imageChart.append('h3')
                    .attr('class', 'cyberbullying-title')
                    .text(cyberStalkingData.title);

                imageChart.append('img')
                    .attr('src', cyberStalkingData.imageUrl);
            }

            function onlineHarassment() {
                var graphData = [];
                var data = onlineHarassmentData.barData;

                var selection = d3.select('.infographic__wrapper div');
                var onlineHarassmentContainer = selection.append('div')
                    .attr('class', 'online-harassment');

                var chart = controller._utilsService.columnChart()
                  .margin({ top: 20, right: 30, bottom: 110, left: 40 })
                  .width(graphWidth)
                  .height(graphWidth / 1.5)
                  .yAxisFormat(d3.format("%"))
                  .xGrid(true);

                // transform the raw data into what the below function expects
                for (var i = 0, l = data.length; i < l; i++) {
                  graphData.push([data[i].label, data[i].value]);
                }

                onlineHarassmentContainer.datum(graphData).call(chart);

                var $chart = $('.column-chart', $container);
                var $title = $('<h3 />', {
                    text: onlineHarassmentData.title
                });
                $title.insertBefore($chart);
            }

            // if there is a source for the infographic, add it.
            if (infographic._source.name) {
                controller._utilsService.addSource(infographic._source, $container);
            }
        });
    };

    return ChartCivilityDirective;
});
