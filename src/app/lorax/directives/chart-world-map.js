/**
 * @fileOverview World Map Chart directive
 * @author <a href='mailto:chris@work.co'>Chris James</a>
 */
define(['jquery', 'd3', 'topojson', 'jquery-customselect'], function ($, d3, topojson) {
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
        this._dataService = dataService;
        this._getMap = this._dataService.getMap();
    };

    /**
     * Initialize all variables for map infographic.
     * @param {JSON} mapData            SVG data.
     * @param {JSON} countryData        Infographic data.
     */
    ChartWorldMapController.prototype._init = function (mapData, countryData) {
        this.map = {
            mapData: mapData,
            countryData: countryData,
            demoMode: true,
            demoTimer: null,
            shadeName: this._$scope.issue.getInfographic().getDataPoints().countryData.shading.name,
            shadeValues: this._$scope.issue.getInfographic().getDataPoints().countryData.shading.values,
            shadeInvert: this._$scope.issue.getInfographic().getDataPoints().countryData.shading.invert,
            shadeLegend: this._$scope.issue.getInfographic().getDataPoints().countryData.shading.legend,
            displayDataset: this._$scope.issue.getInfographic().getDataPoints().countryData.display.name,
            displayUnits: this._$scope.issue.getInfographic().getDataPoints().countryData.display.units,
            displayReduceSize: this._$scope.issue.getInfographic().getDataPoints().countryData.display.reduceSize,
            infographicData: {},
            width: 938,
            height: 500,
            defaultCountry: 'CHN',
            enableHover: {
                'small': false,
                'medium': false,
                'large': true,
                'xlarge': true
            },
            labelLocation: [
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
            ]
        };

        this.map.colorScale = this._setShading(this.map.shadeValues, this.map.shadeInvert);

        $.each(this.map.countryData, function(key, data) {
            var id = data.id;
            var displayName = data.displayName;
            var shadeData = data[this.map.shadeName];
            var displayData = data[this.map.displayDataset];
            var labelArea = data.labelArea;

            this.map.infographicData[id] = {
                'displayName': displayName,
                'shadeData': shadeData,
                'displayData': displayData,
                'displayUnits': this.map.displayUnits,
                'labelArea': labelArea
            };
        }.bind(this));
    };

    /**
     * Initialize and draw dropdown menu for map infographic.
     */
    ChartWorldMapController.prototype._drawDropdown = function () {
        var dropDown = this.map.map.append('select')
            .attr('class', 'worldmap__dropdown');

        dropDown.append('option')
            .attr('value', function() { return this._$scope.issue.getInfographic().getDataPoints().countryData.findCountry; }.bind(this))
            .text(function() { return this._$scope.issue.getInfographic().getDataPoints().countryData.findCountry; }.bind(this));

        $.each(this.map.countryData, function(key, data) {
            if (this.map.infographicData[data.id] && this.map.infographicData[data.id].displayData && this.map.infographicData[data.id].labelArea) {
                dropDown.append('option')
                    .attr('value', data.id)
                    .text(data.displayName);
            }
        }.bind(this));

        $('#' + this._$scope.issue.getId() + ' .infographic__wrapper div select').change( function(evt) {
            if ( this.map.infographicData[evt.target.value] && this.map.infographicData[evt.target.value].displayData ) {
                if (this.map.demoMode){
                    this.map.demoMode = false;
                    this._demoMode();
                }
                this._selectCountry(evt.target.value);

            }
        }.bind(this));
    };

    /**
     * Highlights country and changes label data for map infographic.
     * @param {string} countryId        3 letter ID code.
     */
    ChartWorldMapController.prototype._selectCountry = function (countryId) {
        var country = this.map.g.select('#' + countryId);

        this.map.map.select('.worldmap__label-country')
            .text('');
        this.map.map.select('.worldmap__label-data')
            .text('');
        this.map.g.selectAll('path')
            .style('fill', function(d) {
            if (this.map.infographicData[d.id] && this.map.infographicData[d.id].displayData) {
                return this.map.colorScale(this.map.infographicData[d.id].shadeData);
            } else {
                return 'rgba(0,0,0,0.15)';
            }
        }.bind(this));

        country.style('fill', '#fff');

        if ( this.map.enableHover[this._windowService.breakpoint()]) {
            this.map.labelContainer.style('left', function() {
                    var labelArea = this.map.infographicData[countryId].labelArea;
                    return this.map.labelLocation[labelArea].left + '%';
                }.bind(this))
                .style('top', function() {
                    var labelArea = this.map.infographicData[countryId].labelArea;
                    return this.map.labelLocation[labelArea].top + '%';
                }.bind(this));
        }
        else {
            this.map.labelContainer.style('left', '50%')
                .style('top', '50%');
        }

        this.map.map.select('.worldmap__label-country')
            .text(this.map.infographicData[countryId].displayName);
        this.map.map.select('.worldmap__label-data')
            .text(this.map.infographicData[countryId].displayData + this.map.infographicData[countryId].displayUnits);
    };

    /**
     * Initialize and draw legend for map infographic.
     */
    ChartWorldMapController.prototype._drawLegend = function () {
        var legend = this.map.map.append('div')
            .attr('class', 'worldmap__legend');

        var legendLabel = legend.selectAll('.worldmap__legend-label')
            .data(this.map.shadeLegend)
            .enter()
            .append('div')
                .attr('class', 'worldmap__legend-label');

        legendLabel.append('div')
            .style('width', 15 + 'px')
            .style('height', 15 + 'px')
            .style('background', function(d, i) { return this.map.colorScale(this.map.shadeValues[i]-0.01);}.bind(this)); // subtract 0.01 to take scale offset into consideration

        legendLabel.append('p')
            .attr('left', 20 + 'px')
            .attr('top', 7.5 + 'px')
            .text(function(d) { return d; });
    };

    /**
     * Initialize and draw SVG map for map infographic.
     */
    ChartWorldMapController.prototype._drawMap = function () {
          var countryOver = function (d) {
            if (d) {
                if ( this.map.infographicData[d.id] && this.map.infographicData[d.id].displayData && this.map.enableHover[this._windowService.breakpoint()] ) {
                    if (this.map.demoMode){
                        this.map.demoMode = false;
                        this._demoMode();
                    }
                    this._selectCountry(d.id);
                }
            }
          }.bind(this);

        this.map.map = d3.select('#' + this._$scope.issue.getId() + ' .infographic__wrapper div')
            .attr('class', 'worldmap');
        this.map.mapWidth = $('#' + this._$scope.issue.getId() + ' .infographic__wrapper div').width();

        var projection = d3.geo.mercator()
          .scale(150)
          .translate([this.map.width / 2, this.map.height / 1.5]);

        var path = d3.geo.path()
            .projection(projection);

        this.map.svg = this.map.map.append('svg')
            .attr('preserveAspectRatio', 'xMidYMid')
            .attr('viewBox', '0 0 ' + this.map.width + ' ' + this.map.height)
            .attr('width', this.map.mapWidth)
            .attr('height', this.map.mapWidth * this.map.height / this.map.width);

        this.map.svg.append('rect')
            .attr('class', 'worldmap__background')
            .attr('width', this.map.width)
            .attr('height', this.map.height);

        this.map.g = this.map.svg.append('g');

        this.map.g.append('g')
            .attr('class', 'worldmap__countries')
            .selectAll('path')
            .data(topojson.feature(this.map.mapData, this.map.mapData.objects.countries).features)
            .enter()
            .append('path')
                .attr('id', function(d) { return d.id; })
                .attr('class', 'worldmap__country')
                .style('fill', function(d) {
                if (this.map.infographicData[d.id] && this.map.infographicData[d.id].displayData) {
                    return this.map.colorScale(this.map.infographicData[d.id].shadeData);
                } else {
                    return 'rgba(0,0,0,0.15)';
                }
            }.bind(this))
            .attr('d', path)
            .on('mouseover', countryOver);
    };

    /**
     * Initialize all variables for map infographic.
     * @param {array} shadeValues         Range of values for country shading.
     * @param {boolean} shadeInvert       Determines order of shading.
     */
    ChartWorldMapController.prototype._setShading = function (shadeValues, shadeInvert) {
        var opacity = 0.8;
        var minOpacity = 0.8;
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
    };

    /**
     * Resize map infographic when window is resized.
     */
    ChartWorldMapController.prototype._resize = function () {
        var hasWidth = false;
        var updateSize = function () {
            var w = $('#' + this._$scope.issue.getId() + ' .infographic__wrapper div').width();
            hasWidth = w > 0;
            if (hasWidth) {
                this.map.svg.attr('width', w);
                this.map.svg.attr('height', w * this.map.height / this.map.width);
            }
        }.bind(this);

        $(window).resize(updateSize);

        var resizeInterval = setInterval(function () {
            updateSize();
            if (hasWidth) {
                clearTimeout(resizeInterval);
            }
        }, 5000);
    };

    /**
     * Initialize and draw label for map infographic.
     */
    ChartWorldMapController.prototype._drawLabel = function () {
        this.map.labelContainer = this.map.map.append('div')
            .attr('class', 'worldmap__label-container')
            .style('left', function() {
                var label = this.map.infographicData[this.map.defaultCountry].labelArea;
                return this.map.labelLocation[label].left + '%';
            }.bind(this))
            .style('top', function() {
                var labelArea = this.map.infographicData[this.map.defaultCountry].labelArea;
                return this.map.labelLocation[labelArea].top + '%';
            }.bind(this));

      this.map.labelContainer.append('div')
        .attr('class', 'worldmap__label worldmap__label-country');

      this.map.labelContainer.append('div')
        .attr('class', function() {
            if (this.map.displayReduceSize) {
                return 'worldmap__label worldmap__label-data worldmap__label-data-font-small';
            } else {
                return 'worldmap__label worldmap__label-data worldmap__label-data-font-normal';
            }
        }.bind(this));
    };

    /**
     * Rotates through country data until the user interacts with the map.
     */
    ChartWorldMapController.prototype._demoMode = function () {
        var switchCountry = function() {
            var validCountry = false;
            var countryId = '';
            while (!validCountry){
                var countryIndex = Math.floor(Math.random() * this.map.countryData.length);
                countryId = this.map.countryData[countryIndex].id;
                if (this.map.infographicData[countryId].displayData && this.map.infographicData[countryId].labelArea) {
                    validCountry = true;
                }
            }
            this._selectCountry(countryId);
        }.bind(this);

        if (this.map.demoMode) {
            this._selectCountry(this.map.defaultCountry);
            this.map.demoTimer  = setInterval(switchCountry, 2500);
        }
        else {
            clearInterval(this.map.demoTimer);
        }
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
        controller._getMap.then( function (model) {
            controller._$timeout( function() {
                controller._init(model.geoData, model.countryData);
                controller._drawMap();
                controller._drawLabel();
                controller._drawLegend();
                controller._drawDropdown();
                controller._resize();
                controller._demoMode();

                $('#' + controller._$scope.issue.getId() + ' .infographic__wrapper div select').customSelect({
                    customClass: 'worldmap__dropdown-select'
                });
            }.bind(controller));
        }.bind(controller));
    };

  return ChartWorldMapDirective;
});
