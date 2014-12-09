/**
 * @fileOverview Zero Rating Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
  'use strict';

  /**
   * Zero Rating Chart directive
   */
  var ChartZeroRatingDirective = function () {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: ChartZeroRatingController,
      link: ChartZeroRatingLinkFn,
      templateUrl: '/app/lorax/directives/chart-zero-rating.tpl.html'
    };
  };

  /**
   * Controller for Zero Rating Chart directive
   * @constructor
   */
  var ChartZeroRatingController = function (
    $scope,
    $timeout
    )
  {
    this._$scope = $scope;
    this._$timeout = $timeout;
    this._data = this._$scope.issue.getInfographic().getDataPoints().cycle;
    this._$scope.zeroRating = {
      data: this._data
    };
  };

  /**
   * Array of dependencies to be injected into controller
   * @type {Array}
   */
  ChartZeroRatingController.$inject = [
    '$scope',
    '$timeout'
  ];

  /**
   * Link function for Zero Rating Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartZeroRatingLinkFn = function (scope, iElem, iAttrs, controller) {
    controller._$timeout(function() {
      var id = controller._$scope.issue.getId();
      var zeroChart = d3.select('#' + id + ' .infographic__wrapper div');

      var margin = 120;
      var width = 500;
      var height = 500;

      var svg = zeroChart.insert('svg', ':first-child')
        .attr('class', 'zero-rating__svg')
        .attr('width', width + margin)
        .attr('height', height + margin);

      svg.insert('circle')
        .attr('class', 'zero-rating__circle-shape')
        .attr('transform', 'translate(' + margin/2 + ',' + margin/2 + ')')
        .attr('cx', width/2)
        .attr('cy', height/2)
        .attr('r', width/2);

      svg.append('polygon')
        .attr('class', 'zero-rating__triangle-shape')
        .attr('transform', 'translate(' + margin/2 + ',' + margin/2 + ')')
        .attr('points', function() {
          var points = [
            [width/2, 0].join(','),
            [(width/2) + (Math.cos(Math.PI/6)*width/2),(height/2) + (Math.sin(Math.PI/6)*height/2)].join(','),
            [(width/2) + (-Math.cos(Math.PI/6)*width/2),(height/2) + (Math.sin(Math.PI/6)*height/2)].join(',')
          ].join(' ');
          return points;
        });

        zeroChart.selectAll('.zero-rating__circle-outside')
            .style('mask', 'url(#maskStripe)');


    }.bind(controller));
  };

  return ChartZeroRatingDirective;
});
