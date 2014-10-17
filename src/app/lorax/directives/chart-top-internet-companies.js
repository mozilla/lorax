/**
 * @fileOverview Top Internet Companies Chart directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
  'use strict';

  /**
   * Top Internet Companies directive
   */
  var ChartTopInternetCompaniesDirective = function () {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: ChartTopInternetCompaniesController,
      link: ChartTopInternetCompaniesLinkFn
    };
  };

  /**
   * Controller for Top Internet Companies directive
   * @constructor
   */
  var ChartTopInternetCompaniesController = function (
    $scope
    )
  {
    this._$scope = $scope;
  };

  /**
   * Array of dependencies to be injected into controller
   * @type {Array}
   */
  ChartTopInternetCompaniesController.$inject = [
    '$scope'
  ];

  /**
   * Link function for Top Internet Companies Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartTopInternetCompaniesLinkFn = function () {
    d3.json('/scripts/data/decentralized-power.json', function (error, res) {
      var data = res.internetCompaniesByRevenue;
      var chart = d3.select('.decentralized-power');

      // get the top revenue of all companies
      var maxRevenue = data[0].revenue;
      // max value of scale
      var maxScale = 100;

      var companies = chart.selectAll('div')
        .data(data)
        .enter()
        .append('div')
          .attr('class', 'internet-company cf');

      companies.append('div')
        .attr('class', 'internet-company__revenue')
        .text(function (d) {
          return d.revenue;
        });

      companies.append('div')
        .attr('class', 'internet-company__title')
        .text(function (d) {
          return d.name;
        });

      companies.append('div')
        .attr('class', 'internet-company__diff')
        .text(function (d) {
          var diff = (maxRevenue - d.revenue).toFixed(2);

          return (diff > 0) ? '-' + diff + 'm' : '';
        });

      companies.append('div')
        .attr('class', 'internet-company__max-rev')
        .text(maxScale + 'm');

      companies.append('div')
        .attr('class', 'internet-company__scale internet-company__scale--actual')
        .attr('style', function (d) {
          return 'width: ' + d.revenue + '%';
        });

      companies.append('div')
        .attr('class', 'internet-company__scale internet-company__scale--full');

      companies.append('div')
        .attr('class', 'internet-company__scale internet-company__scale--marker')
        .attr('style', function (d, i) {
          var display = (i === 0) ? 'display: none;' : '';
          return 'width: ' + maxRevenue + '%;' + display;
        });
    });
  };

  return ChartTopInternetCompaniesDirective;
});
