/**
 * @fileOverview Surveillance Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
  'use strict';

  /**
   * Surveillance Chart directive
   */
  var ChartSurveillanceDirective = function () {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: ChartSurveillanceController,
      link: ChartSurveillanceLinkFn
    };
  };

  /**
   * Controller for Surveillance Chart directive
   * @constructor
   */
  var ChartSurveillanceController = function (
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
  ChartSurveillanceController.$inject = [
    '$scope',
    '$timeout',
    'utilsService'
  ];

  /**
   * Link function for Surveillance Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartSurveillanceLinkFn = function (scope, iElem, iAttrs, controller) {
    controller._$timeout(function() {
      var infographic = scope.modalIssue.issue.getInfographic();
      var circleData = infographic.getDataPoints().surveillance;
      var circleChart = d3.select('#modal-issue .infographic__wrapper div');

      var $modal =  $('#modal-issue');
      var container = $('.infographic__wrapper div', $modal);

      var width = 650;
      var height = 650;

      var circleSize = width/5.5;
      var circleFromCenter = height/3;
      var twoPi = (Math.PI*2);

      var surveillanceData = {};

      $.each(circleData, function(key, data) {
        var id = 'surveillance__name-' + data.name.toLowerCase().replace(/[^A-Z0-9]/ig, '_');
        var description = data.description;

        surveillanceData[id] = {
          'description': description
        };
      });

      var background = circleChart.append('div')
        .attr('class','surveillance__background')
        .style('width', width + 'px')
        .style('height', height + 'px');

      background.append('p')
        .attr('class', 'surveillance__descriptionbox')
        .style('left', width/2 - (circleFromCenter - circleFromCenter/5)/2 - circleSize/2 + 'px')
        .style('top', height/2 - circleFromCenter/2.5 + 'px');

      var circleContainer = background.append('div')
        .attr('class', 'surveillance__circlecontainer')
        .style('left', width/2 - (circleFromCenter - circleFromCenter/5)/2 + 'px')
        .style('top', height/2 - circleFromCenter/5 + 'px');

      circleContainer.selectAll('div')
        .data(circleData)
        .enter()
        .append('div')
          .attr('class', 'surveillance__label')
          .attr('id', function(d) { return 'surveillance__name-' + d.name.toLowerCase().replace(/[^A-Z0-9]/ig, '_'); })
          .style('left', function(d, i) { return Math.cos( twoPi * i/circleData.length) * circleFromCenter + 'px'; })
          .style('top', function(d, i) { return Math.sin( twoPi * i/circleData.length) * circleFromCenter + 'px'; })
          .on('mouseover', addDescription)
          .append('p')
            .html( function(d, index) { return d.name; });

      d3.select('#surveillance__name-advertising')
        .style('border', '3px solid #fff');

      d3.select('.surveillance__descriptionbox')
        .text( surveillanceData['surveillance__name-advertising'].description);



      function addDescription() {
        d3.select('.surveillance__descriptionbox')
          .text( surveillanceData[this.id].description );

        d3.selectAll('.surveillance__label')
          .style('border', 'none');

        d3.select(this)
          .style('border', '3px solid #fff');
      }

      // if there is a source for the infographic, add it.
      if (infographic._source.name) {
          controller._utilsService.addSource(infographic._source, container);
      }

    }.bind(controller));
  }

  return ChartSurveillanceDirective;
});
