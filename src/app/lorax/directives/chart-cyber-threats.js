/**
 * @fileOverview Cyber Threats Chart directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery', 'd3'], function ($, d3) {
  'use strict';

  /**
   * Cyber Threats Chart directive
   */
  var ChartCyberThreatsDirective = function () {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: ChartCyberThreatsController,
      link: ChartCyberThreatsLinkFn
    };
  };

  /**
   * Controller for Cyber Threats Chart directive
   * @constructor
   */
  var ChartCyberThreatsController = function (
    $scope,
    $timeout
    )
  {
    this._$scope = $scope;
    this._$timeout = $timeout;
  };

  /**
   * Array of dependencies to be injected into controller
   * @type {Array}
   */
  ChartCyberThreatsController.$inject = [
    '$scope',
    '$timeout'
  ];

  /**
   * Link function for Cyber Threats Chart directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ChartCyberThreatsLinkFn = function (scope, iElem, iAttrs, controller) {
    controller._$timeout(function() {
      var circleData = controller._$scope.issue.getInfographic().getDataPoints().cyberThreats;
      var id = controller._$scope.issue.getId();
      var circleChart = d3.select("#" + id + " .infographic__wrapper div");

      var graphWidth = $("#" + id + " .infographic__wrapper div").width();
      var width = graphWidth;
      var height = graphWidth * .7;

      var circleSize = 55;
      var circleFromCenter = height/2.5;
      var twoPi = (Math.PI*2);

      var threatData = {};

      $.each(circleData, function(key, data) {
        var id = "cyberthreat__name-" + data.name.toLowerCase().replace(/[^A-Z0-9]/ig, "_");
        var description = data.description;

        threatData[id] = {
          "description": description
        }
      });

      var svg = circleChart.append("svg")
        .attr("width", graphWidth)
        .attr("height", graphWidth * height / width);

      var descriptionBox = svg.append("g")
        .attr("class", "cyberthreat__descriptionbox")
        .attr("transform", function() {
          var x = svg.attr("width")/2 - (circleFromCenter - circleFromCenter/5)/2;
          var y = svg.attr("height")/2 - circleFromCenter/5;
          return "translate(" + x + "," + y + ")";
        });

      descriptionBox.append("rect")
        .attr("width", circleFromCenter - circleFromCenter/5)
        .attr("height", circleFromCenter - circleFromCenter/5);

      descriptionBox.append("text")
          .attr("class", "cyberthreat__description")
          .attr("font-size", 12);

      var cyberThreatGroup = svg.append("g")
        .attr("class", "cyberthreat__group")
        .attr("transform", "translate(" + svg.attr("width")/2 + "," + svg.attr("height")/2 + ")");

      var labels = cyberThreatGroup.selectAll("g")
        .data(circleData)
        .enter()
        .append("g")
          .attr("class", "cyberthreat__label")
          .attr("transform", function(d,i) {
            var x = Math.cos( twoPi * i/circleData.length) * circleFromCenter;
            var y = Math.sin( twoPi * i/circleData.length) * circleFromCenter;
            return "translate(" + x + "," + y + ")";
          })
          .on("mouseover", addDescription)
          .on("mouseout", removeDescription);

      labels.append("circle")
        .attr("class", "cyberthreat__circle")
        .style("fill", function(d) { 
            if( d.category === "Vulnerabilities")
              return "rgba(0,0,0,0.7)";
            else if( d.category === "Malware")
              return "rgba(0,0,0,0.5)";
            else( d.category === "Exploits")
              return "rgba(0,0,0,0.3)";
          })
        .attr("r", circleSize);

      labels.append("text")
        .attr("class", "cyberthreat__name")
        .attr("id", function(d) { return "cyberthreat__name-" + d.name.toLowerCase().replace(/[^A-Z0-9]/ig, "_"); })
        .attr("text-anchor", "middle")
        .attr("y", -10)
        .attr("font-size", 14)
        .text(function(d) { return d.name; });

      $.each( d3.selectAll(".cyberthreat__name")[0], function(key, value) {
        d3plus.textwrap()
          .container(d3.select("#" + value.id))
          .width(circleSize*2-20)
          .draw();
      });

      drawLegend();

      function drawLegend() {
        boxSize = 10;
        startX = 0;
        startY = 10;

        svg.append("g")
          .attr("class", "cyberthreat__legend");

        var legend = d3.select(".cyberthreat__legend");

        legend.append("rect")
          .attr("x", 0)
          .attr("y", startY + boxSize)
          .attr("width", boxSize)
          .attr("height", boxSize)
          .style("fill", "rgba(0,0,0,0.7)");

        legend.append("text")
          .attr("class", "cyberthreat__legend-text")
          .attr("x", startX + boxSize*2)
          .attr("y", startY + boxSize*2)
          .text("Vulnerabilities");

        legend.append("rect")
          .attr("x", 0)
          .attr("y", startY + boxSize*3)
          .attr("width", boxSize)
          .attr("height", boxSize)
          .style("fill", "rgba(0,0,0,0.5)");

        legend.append("text")
          .attr("class", "cyberthreat__legend-text")
          .attr("x", startX + boxSize*2)
          .attr("y", startY + boxSize*3 + boxSize)
          .text("Malware");

        legend.append("rect")
          .attr("x", 0)
          .attr("y", startY + boxSize*5)
          .attr("width", boxSize)
          .attr("height", boxSize)
          .style("fill", "rgba(0,0,0,0.3)");

        legend.append("text")
          .attr("class", "cyberthreat__legend-text")
          .attr("x", startX + boxSize*2)
          .attr("y", startY + boxSize*5 + boxSize)
          .text("Exploits");
      }

      function addDescription() {
        d3.select(".cyberthreat__description")
          .text( threatData[this.childNodes[1].id].description );
        d3plus.textwrap()
          .container(d3.select(".cyberthreat__description"))
          .draw()

        d3.select(this.childNodes[0])
          .style("stroke", "#fff");
      }

      function removeDescription() {
        d3.select(this.childNodes[0])
          .style("stroke", "none");
      }

    }.bind(controller));
  }

  return ChartCyberThreatsDirective;
});
