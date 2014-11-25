/**
 * @fileOverview World Map Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 */
define(['jquery', 'd3', 'topojson', 'jquery-selectric'], function ($, d3, topojson) {
  'use strict';

  /**
   * World Map Chart directive
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
   * Controller for World Map Chart directive
   * @constructor
   */
  var ChartWorldMapController = function (
    $scope,
    $timeout,
    dataService,
    windowService
    )
  {
    this._$scope = $scope;
    this._$timeout = $timeout;
    this._windowService = windowService;
    this._getMap = dataService.getMap();
  };

  /**
   * Array of dependencies to be injected into controller
   * @type {Array}
   */
  ChartWorldMapController.$inject = [
    '$scope',
    '$timeout',
    'dataService',
    'windowService'
  ];

  /**
   * Link function for World Map Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartWorldMapLinkFn = function (scope, iElem, iAttrs, controller) {
    controller._getMap.then(function (model) {
        controller._$timeout( function() {
          var issueId = controller._$scope.issue.getId();

          var mapData = model.geoData;
          var countryData = model.countryData;

          var shadeName = controller._$scope.issue.getInfographic().getDataPoints().countryData.shading.name;
          var shadeValues = controller._$scope.issue.getInfographic().getDataPoints().countryData.shading.values;
          var shadeInvert = controller._$scope.issue.getInfographic().getDataPoints().countryData.shading.invert;
          var shadeLegend = controller._$scope.issue.getInfographic().getDataPoints().countryData.shading.legend;
          var displayDataset = controller._$scope.issue.getInfographic().getDataPoints().countryData.display.name;
          var displayUnits = controller._$scope.issue.getInfographic().getDataPoints().countryData.display.units;
          var colorScale = setShading(shadeValues, shadeInvert);
          var enableHover = {
            'small': false,
            'medium': false,
            'large': true,
            'xlarge': true
          };

          var infographicData = {};
          $.each(countryData, function(key, data) {
            var id = data.id;
            var displayName = data.displayName;
            var shadeData = data[shadeName];
            var displayData = data[displayDataset];
            var labelArea = data.labelArea;

            infographicData[id] = {
              'displayName': displayName,
              'shadeData': shadeData,
              'displayData': displayData,
              'displayUnits': displayUnits,
              'labelArea': labelArea
            };
          });

          var map = d3.select('#' + issueId + ' .infographic__wrapper div')
            .attr('class', 'worldmap');
          var mapWidth = $('#' + issueId + ' .infographic__wrapper div').width();
          var width = 938;
          var height = 500;

          var labelLocation = [
              {
                'left': 33,
                'top': 42
              },
              {
                'left': 41,
                'top': 74
              },
              {
                'left': 66,
                'top': 65
              },
              {
                'left': 85,
                'top': 50
              }
          ];

          drawDropdown();

          var defaultCountry = 'CHN';

          var projection = d3.geo.mercator()
              .scale(150)
              .translate([width / 2, height / 1.5]);

          var path = d3.geo.path()
            .projection(projection);

          var svg = map.append('svg')
            .attr('preserveAspectRatio', 'xMidYMid')
            .attr('viewBox', '0 0 ' + width + ' ' + height)
            .attr('width', mapWidth)
            .attr('height', mapWidth * height / width);

          svg.append('rect')
            .attr('class', 'worldmap__background')
            .attr('width', width)
            .attr('height', height);

          var g = svg.append('g');

          g.append('g')
            .attr('id', 'countries')
            .selectAll('path')
            .data(topojson.feature(mapData, mapData.objects.countries).features)
            .enter()
            .append('path')
              .attr('id', function(d) { return d.id; })
              .style('fill', function(d) {
                if (infographicData[d.id] && infographicData[d.id].displayData) {
                  return colorScale(infographicData[d.id].shadeData);
                } else {
                  return 'rgba(0,0,0,0.15)';
                }
              })
              .attr('d', path)
              .on('mouseover', countryOver);

            var labelContainer = map.append('div')
                .attr('class', 'worldmap__label-container')
                .style('left', function() {
                    var label = infographicData[defaultCountry].labelArea;
                    return labelLocation[label].left + '%';
                })
                .style('top', function() {
                    var labelArea = infographicData[defaultCountry].labelArea;
                    return labelLocation[labelArea].top + '%';
                });

          labelContainer.append('div')
            .attr('class', 'worldmap__label worldmap__label-country');

          labelContainer.append('div')
            .attr('class', 'worldmap__label worldmap__label-data');


            selectCountry(defaultCountry);
          initializeSvgFilters(svg);
          drawLegend();

          $('#' + issueId + ' .infographic__wrapper div select').selectric('init');

          function countryOver (d) {
            if (d) {
              if ( infographicData[d.id] && infographicData[d.id].displayData && enableHover[controller._windowService.breakpoint()] ) {
                selectCountry(d.id);
              }
            }
          }

          function drawLegend() {
            var legend = map.append('div')
                .attr('class', 'worldmap__legend');

            var legendLabel = legend.selectAll('.worldmap__legend-label')
                .data(shadeLegend)
                .enter()
                .append('div')
                    .attr('class', 'worldmap__legend-label');

            legendLabel.append('div')
                .style('width', 15 + 'px')
                .style('height', 15 + 'px')
                .style('background', function(d, i) { return colorScale(shadeValues[i]-0.01);}); // subtract 0.01 to take scale offset into consideration

            legendLabel.append('p')
                .attr('left', 20 + 'px')
                .attr('top', 7.5 + 'px')
                .text(function(d) { return d; });
          }

        function drawDropdown() {
            var dropDown = map.append('select')
                .attr('class', 'worldmap__dropdown');

            dropDown.append('option')
                .attr('value', 'Find a country')
                .text('Find a country');

            $.each(countryData, function(key, data) {
                if (infographicData[data.id] && infographicData[data.id].displayData) {
                    dropDown.append('option')
                        .attr('value', data.id)
                        .text(data.displayName);
                }
            });


            $('#' + issueId + ' .infographic__wrapper div select').change( function() {
                if ( infographicData[this.value] && infographicData[this.value].displayData ) {
                    selectCountry(this.value);
                }
            });
        }

        function selectCountry(countryId) {
          var country = g.select('#' + countryId);

          map.select('.worldmap__label-country')
            .text('');
          map.select('.worldmap__label-data')
            .text('');
          g.selectAll('path')
            .style('fill', function(d) {
              if (infographicData[d.id] && infographicData[d.id].displayData) {
                return colorScale(infographicData[d.id].shadeData);
              } else {
                return 'rgba(0,0,0,0.15)';
              }
            });

          country.style('mask','');
          country.style('fill', '#fff');

          if ( enableHover[controller._windowService.breakpoint()]) {
            labelContainer.style('left', function() {
                    var labelArea = infographicData[countryId].labelArea;
                    return labelLocation[labelArea].left + '%';
                })
                .style('top', function() {
                    var labelArea = infographicData[countryId].labelArea;
                    return labelLocation[labelArea].top + '%';
                });
          }
          else {
            labelContainer.style('left', '50%')
                .style('top', '50%');
          }

          map.select('.worldmap__label-country')
            .text(infographicData[countryId].displayName);
          map.select('.worldmap__label-data')
            .text(infographicData[countryId].displayData + infographicData[countryId].displayUnits);
        }

        $(window).resize(function() {
            var w = $('#' + issueId + ' .infographic__wrapper div').width();
            svg.attr('width', w);
            svg.attr('height', w * height / width);
        });
        }.bind(controller));
    }.bind(controller));
  };

  function setShading(shadeValues, shadeInvert) {
    var opacity = 1.0;
    var minOpacity = 1.0;
    var opacityMod = minOpacity/(shadeValues.length);
    var countryColors = [];
    for (var i = 0; i < shadeValues.length; i++) {
      countryColors.push('rgba(0,0,0,' + (opacity-i*opacityMod) + ')');
    }

    if (shadeInvert) {
        countryColors.reverse();
    }

    var colorScale = d3.scale.threshold()
      .domain(shadeValues)
      .range(countryColors);
    return colorScale;
  }

  function initializeSvgFilters(svg) {
    var defs = svg.append('defs');

    defs.append('pattern')
      .attr('id', 'patternStripe')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', '100%')
      .attr('height', '100%')
      .append('image')
        .attr('xlink:href', '../images/map_stripe.png')
        .attr('width', '100%')
        .attr('height', '100%');

    defs.append('mask')
      .attr('id', 'maskStripe')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'url(#patternStripe)');
  }

  return ChartWorldMapDirective;
});
