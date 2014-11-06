/**
 * @fileOverview Terms & Conditions Chart directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
  'use strict';

  /**
   * Terms & Conditions Chart directive
   */
  var ChartTermsAndConditionsDirective = function () {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: ChartTermsAndConditionsController,
      link: ChartTermsAndConditionsLinkFn
    };
  };

  /**
   * Controller for Terms & Conditions Chart directive
   * @constructor
   */
  var ChartTermsAndConditionsController = function (
    $scope
    )
  {
    this._$scope = $scope;
  };

  /**
   * Array of dependencies to be injected into controller
   * @type {Array}
   */
  ChartTermsAndConditionsController.$inject = [
    '$scope'
  ];

  /**
   * Link function for Terms and Conditions Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartTermsAndConditionsLinkFn = function () {
    debugger;

    d3.json('/scripts/data/terms-and-conditions.json', function (error, res) {
      var data = res.termsAndConditions;
      var chart = d3.select('.terms-and-conditions');

      var companies = chart.selectAll('div')
        .data(data)
        .enter()
        .append('div')
          .attr('class', 'terms-company cf');

      companies.append('div')
        .attr('class', 'terms-company__length')
        .text(function (d) {
          return Math.round(d.length / 1000) + 'k';
        });

      companies.append('div')
        .attr('class', 'terms-company__title')
        .text(function (d) {
          return d.name;
        });

      companies.append('div')
        .attr('class', 'terms-company__stacks');

      $('.terms-company__stacks').each(function (idx) {
        var $this = $(this);
        var length = data[idx].length;
        var numBars = Math.round(length / 1000) * 2;

        for (var i = 0; i < numBars; i++) {
          $this.append('<div class="stacks-item"></div>');
        }
      });
    });
  };

  return ChartTermsAndConditionsDirective;
});
