/**
 * @fileOverview World Map Chart directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery', 'd3', 'topojson'], function ($, d3, topojson) {
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
   * Link function for World Map Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartWorldMapLinkFn = function (scope, iElem, iAttrs, controller) {
    controller._getMap.then(function (model) {
      var issueId = controller._$scope.issue.getId();

      var mapData = model.geoData;
      var countryData = model.countryData;

      var shadeName = controller._$scope.issue.getInfographic().getDataPoints().countryData.shading.name;
      var shadeValues = controller._$scope.issue.getInfographic().getDataPoints().countryData.shading.values;
      var shadeLegend = controller._$scope.issue.getInfographic().getDataPoints().countryData.shading.legend;
      var displayDataset = controller._$scope.issue.getInfographic().getDataPoints().countryData.display.name;
      var displayUnits = controller._$scope.issue.getInfographic().getDataPoints().countryData.display.units;

      var infographicData = {};
      $.each(countryData, function(key, data) {
        var id = data.id;
        var displayName = data.displayName;
        var shadeData = data[shadeName];
        var displayData = data[displayDataset];

        infographicData[id] = {
          "displayName": displayName,
          "shadeData": shadeData,
          "displayData": displayData,
          "displayUnits": displayUnits
        }
      });
      
      var map = d3.select("#" + controller._$scope.issue.getId() + " .infographic__wrapper div")
        .attr("class", "map");
      var mapWidth = $("#" + controller._$scope.issue.getId() + " .infographic__wrapper div").width();
      var width = 650;
      var height = 500;

      var defaultCountry = "USA";
      var labelX = 385;
      var labelY = 385;

      var projection = d3.geo.mercator()
          .scale(100)
          .translate([width / 2, height / 1.75]);   
          
      var path = d3.geo.path()
        .projection(projection);   

      var svg = map.append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("width", mapWidth)
        .attr("height", mapWidth * height / width);

      svg.append("rect")
        .attr("class", "worldmap__background")
        .attr("width", width)
        .attr("height", height);
      
      var g = svg.append("g");

      var colorScale = setShading();
       
      g.append("g")
        .attr("id", "countries")
        .selectAll("path")
        .data(topojson.feature(mapData, mapData.objects.countries).features) 
        .enter()
        .append("path")
          .attr("id", function(d) { return d.id; })
          .attr("fill", function(d) { 
            if (infographicData[d.id] && infographicData[d.id].displayData) {
              return colorScale(infographicData[d.id].shadeData);
            } else {
              return "rgba(0,0,0,0.15)";
            }
          })
          .attr("d", path)
          .style("mask", "url(#maskStripe)")
          .on("mouseover", country_over);

      svg.append("text")
        .attr("class", "worldmap__label worldmap__label-country")
        .attr("x", function() { return labelX;})
        .attr("y", function() { return labelY;})
        .attr("text-anchor", "middle")
        .text(infographicData[defaultCountry].displayName);

      svg.append("text")
        .attr("class", "worldmap__label worldmap__label-data")
        .attr("x", function() { return labelX; })
        .attr("y", function() { return labelY+20; })
        .attr("text-anchor", "middle")
        .text(infographicData["USA"].displayUnits + ": " + infographicData["USA"].displayData);  

      g.select("#" + defaultCountry).style("filter", "url(#offsetFilter)");

      initializeSvgFilters(svg);
      drawLegend();

      function country_over (d) {
        if (d) {
          var country = g.select("#" + d.id);
          if ( infographicData[d.id] && infographicData[d.id].displayData ) {
            svg.select(".worldmap__label-country")
              .text("");
            svg.select(".worldmap__label-data")
              .text("");
            g.selectAll("path")
              .style("filter", "")
              .style("mask", "url(#maskStripe)")
              .attr("fill", function(d) { 
                if (infographicData[d.id] && infographicData[d.id].displayData) {
                  return colorScale(infographicData[d.id].shadeData);
                } else {
                  return "rgba(0,0,0,0.15)";
                }
              });

            country.style("mask","");
            country.attr("fill", "#fff");
            country.style("filter", "url(#offsetFilter)");

            svg.select(".worldmap__label-country")
              .text(infographicData[d.id].displayName);
            svg.select(".worldmap__label-data")
              .text(infographicData[d.id].displayUnits + ": " + infographicData[d.id].displayData);
          }
        }
      }

      function setShading() {
        var opacity = 1.0;
        var minOpacity = 0.6;
        var opacityMod = minOpacity/(shadeValues.length-1);
        var countryColors = [];
        for (var i = 0; i < shadeValues.length; i++) {
          countryColors.push("rgba(0,0,0," + (opacity-i*opacityMod) + ")");
        }

        var colorScale = d3.scale.threshold()
          .domain(shadeValues)
          .range(countryColors);
        return colorScale;
      }

      function drawLegend() {
        var legend = svg.selectAll(".worldmap__legend")
          .data(shadeLegend)
          .enter()
          .append("g")
            .attr("class", "worldmap__legend")
            .attr("transform", function(d, i) { return "translate(0," + i*20 + ")";});

        legend.append("rect")
          .attr("x", 0)
          .attr("width", 15)
          .attr("height", 15)
          .style("mask", "url(#maskStripe)")
          .style("fill", function(d, i) { return colorScale(shadeValues[i-1]);});

        legend.append("text")
          .attr("x", 20)
          .attr("y", 7.5)
          .attr("dy", ".35em")
          .text(function(d) { return d; });
      }

    }.bind(controller));
  };

  function initializeSvgFilters(svg) {
    var defs = svg.append("defs");

    var offsetFilter = defs.append("filter")
        .attr("id", "offsetFilter")
        .attr("height", "130%");

    var bright = offsetFilter.append("feComponentTransfer");
        bright.attr("in", "SourceGraphic")
        bright.append("feFuncR")
          .attr("type", "linear")
          .attr("slope", 9999)
        bright.append("feFuncG")
          .attr("type", "linear")
          .attr("slope", "10")
        bright.append("feFuncB")
          .attr("type", "linear")
          .attr("slope", "10")
        bright.attr("result", "brightness");

    offsetFilter.append("feColorMatrix")
        .attr("in", "brightness")
        .attr("type", "saturate")
        .attr("values", 0)
        .attr("result", "desaturate");

    offsetFilter.append("feOffset")
        .attr("in", "desaturate")
        .attr("dx", 0)
        .attr("dy", 0)
        .attr("result", "offset");

    var feOffsetMerge = offsetFilter.append("feMerge");
    feOffsetMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");
    feOffsetMerge.append("feMergeNode")
        .attr("in", "offset");

    var patternStripe = defs.append("pattern")
      // .attr("id", "patternStripe")
      // .attr("width", 2)
      // .attr("height", 2)
      // .attr("patternUnits", "userSpaceOnUse")
      // .attr("patternTransform", "rotate(-45)")
      // .append("rect")
      //   .attr("width", 1)
      //   .attr("height", 2)
      //   .attr("transform", "translate(0,0)")
      //   .attr("fill", "#fff");
      .attr("id", "patternStripe")
      .attr("patternUnits", "userSpaceOnUse")
      .attr("width", "100%")
      .attr("height", "100%")
      .append("image")
        .attr("xlink:href", "../images/map_stripe.png")
        .attr("width", "100%")
        .attr("height", "100%");

    var maskStripe = defs.append("mask")
      .attr("id", "maskStripe")
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "url(#patternStripe)");

  }

  return ChartWorldMapDirective;
});
