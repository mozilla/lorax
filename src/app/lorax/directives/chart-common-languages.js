/**
 * @fileOverview Common Languages Chart directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
  'use strict';

  /**
   * Common Languages Chart directive
   */
  var ChartCommonLanguagesDirective = function () {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: ChartCommonLanguagesController,
      link: ChartCommonLanguagesLinkFn
    };
  };

  /**
   * Controller for Common Languages Chart directive
   * @constructor
   */
  var ChartCommonLanguagesController = function (
    $scope
    )
  {
    this._$scope = $scope;
  };

  /**
   * Array of dependencies to be injected into controller
   * @type {Array}
   */
  ChartCommonLanguagesController.$inject = [
    '$scope'
  ];

  /**
   * Link function for Common Languages Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartCommonLanguagesLinkFn = function () {
    d3.json('/scripts/data/common-languages.json', function (error, res) {
      var data = res.commonLanguages;
      var chart = d3.select('.common-languages-content');

      var maxPercent = res.topPercentageOfLanguages;
      var maxScale = maxPercent + 5;

      var topLanguages = chart.selectAll('div')
        .data(data)
        .enter()
        .append('tr');

      topLanguages.append('td')
        .text(function (d) {
          return d.spoken.pct + '%';
        });

      topLanguages.append('td')
        .append('div')
          .attr('class', 'common-languages-bar cf')
          .append('div')
            .attr('class',
              'common-languages-bar__inner common-languages-bar__inner--spoken')
            .attr('style', function (d) {
              var w = (d.spoken.pct / maxScale) * 100;
              return 'width: ' + w + '%';
            });

      topLanguages.append('td')
        .text(function (d) {
          return d.spoken.lang;
        });

      topLanguages.append('td')
        .text(function (d, i) {
          return i + 1;
        });

      topLanguages.append('td')
        .text(function (d) {
          return d.internet.lang;
        });

      topLanguages.append('td')
        .append('div')
          .attr('class', 'common-languages-bar')
          .append('div')
            .attr('class',
              'common-languages-bar__inner common-languages-bar__inner--internet')
            .attr('style', function (d) {
              var w = (d.internet.pct / maxScale) * 100;
              return 'width: ' + w + '%';
            });

      topLanguages.append('td')
        .text(function (d) {
          return d.internet.pct + '%';
        });
    });
  };

  return ChartCommonLanguagesDirective;
});
