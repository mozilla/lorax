'use strict';

// https://github.com/mbostock/d3/wiki/Tutorials

require(['jquery', 'd3'], function ($, d3) {
  // http://stackoverflow.com/questions/13040685/finding-offset-position-of-svg-element
  d3.selection.prototype.position = function () {

    function getVpPos(el) {
      if (el.parentElement.tagName === 'svg') {
        return el.parentElement.getBoundingClientRect();
      }
      return getVpPos(el.parentElement);
    }

    var el = this.node();
    var elPos = el.getBoundingClientRect();
    var vpPos = getVpPos(el);

    return {
      top: elPos.top - vpPos.top,
      left: elPos.left - vpPos.left,
      width: elPos.width,
      bottom: elPos.bottom - vpPos.top,
      height: elPos.height,
      right: elPos.right - vpPos.left
    };
  };

  // example bar chart
  // http://bost.ocks.org/mike/bar/
  var barChartExampleBasic = function () {
    var exampleBarChartData = [4, 8, 15, 16, 23, 42];

    /* shortform
    d3.select('.example-bar-chart')
      .selectAll('div')
        .data(exampleBarChartData)
      .enter().append('div')
        .style('width', function (d) { return d * 10 + 'px'; })
        .text(function (d) { return d; });*/

    // select the chart container using a class selector.
    var exampleBarChart = d3.select('.example-bar-chart');

    // initiate the data join by defining the selection to which we will join data.
    var bar = exampleBarChart.selectAll('div');

    // join the data to the selection using selection.data.
    var barUpdate = bar.data(exampleBarChartData);

    // since we know the selection is empty, the returned update
    // and exit selections are also empty
    // we need only handle the enter selection which represents new data
    // for which there was no existing element.
    // instantiate these missing elements by appending to the enter selection.
    var barEnter = barUpdate.enter().append('div');

    // set the width of each new bar as a multiple of the associated data value, d.
    // calculated as a percentage value by comparing to max value in array
    barEnter.style('width', function (d) {
      return (d / d3.max(exampleBarChartData)) * 100 + '%';
    });

    // set the text content of each bar, and produce a label
    barEnter.text(function (d) { return d; });
  };

  var barChartExampleSvg = function () {
    // data
    var exampleBarChartData = [4, 8, 15, 16, 23, 42];

    // set bar height, get window width, and max array value
    var barHeight = 20;
    var winWidth = $(window).width();
    var maxVal = d3.max(exampleBarChartData);

    // select the chart container
    var chart = d3.select('.example-bar-chart-svg');

    // create 'g' (svg group) element for each bar, and join data to the selection
    // on 'enter', append g element and set position within svg with css transform
    var barSvg = chart.selectAll('g')
        .data(exampleBarChartData)
      .enter().append('g')
        .attr('transform', function (d, i) {
          return 'translate(0,' + i * barHeight + ')';
        });

    // append 'rect' element to bar, set width and height
    barSvg.append('rect')
      .attr('width', function (d) {
        return (d / maxVal) * 100 + '%';
      })
      .attr('height', barHeight - 1);

    // append 'text' element to bar, set position to 3px from the right of the bar
    barSvg.append('text')
      .attr('x', function (d) { return (winWidth / maxVal) * d - 3; })
      .attr('y', barHeight / 2)
      .attr('dy', '.35em')
      .text(function (d) { return d; });
  };

  var barChartExampleSvgVertical = function () {
    var winWidth = $(window).width();
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = winWidth - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // Set scales for x and y axis
    // When renaming the x scale to the y scale,
    // the range becomes [height, 0] rather than [0, width].
    // This is because the origin of SVG’s coordinate system
    // is in the top-left corner. We want the zero-value to
    // be positioned at the bottom of the chart, rather than the top.
    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.1);

    var y = d3.scale.linear()
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      // format axis to percentages
      // scale will automatically choose a precision appropriate to the tick interval
      .ticks(10, '%');

    var chart = d3.select('.example-bar-chart-vertical')
        //.attr('width', width + margin.left + margin.right)
        //.attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // load json file and...
    d3.json('/scripts/data/letters.json', function (error, res) {
      var data = res.letters;

      x.domain(data.map(function (d) { return d.letter; }));
      y.domain([0, d3.max(data, function (d) { return d.value; })]);

      chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

      chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

      // append title to y axis
      chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Frequency');

      chart.selectAll('.bar')
        .data(data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function (d) { return x(d.letter); })
        .attr('y', function (d) { return y(d.value); })
        .attr('height', function (d) { return height - y(d.value); })
        .attr('width', x.rangeBand());
    });
  };

  // line graph
  // http://dealloc.me/2011/06/24/d3-is-not-a-graphing-library/
  var lineGraph = function () {
    var winWidth = $(window).width();
    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var data = [3, 7, 9, 1, 4, 6, 8, 2, 5];
    var w = winWidth - margin.right - margin.left;
    var h = 500 - margin.top - margin.bottom;
    var max = d3.max(data);

    // Scales
    // The x scale above is saying: “I want a linear scale that represents
    // data between 0 and 8 and I want the values returned to fit in the
    // pixel range of 0 and the width (w).”
    var x = d3.scale.linear().domain([0, data.length - 1]).range([0, w]);
    var y = d3.scale.linear().domain([0, max]).range([h, 0]);

    // Base vis layer
    var vis = d3.select('.line-graph')
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('width', w)
        .attr('height', h);

    // Add path layer
    vis.selectAll('path.line')
      .data([data])
    .enter().append('svg:path')
      .attr('d',
        d3.svg.line()
          //.interpolate(function (points) { return points.join("A 1,1 0 0 1 "); })
          .x(function (d, i) { return x(i); })
          .y(y)
      );

    var xAxis = d3.svg.axis()
      .scale(x)
      //.orient('bottom')
      .ticks(data.length);

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(10);
      // ticks is a method which will return a “uniformly spaced, human readable
      // values guaranteed to be within the extent of the input domain.” In layman’s
      // terms, if the linear range is 0-10, y.ticks(5) will attempt to return 5
      // numbers, evenly spaced between 0-10

    // x axis
    vis.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis);

    // y axis
    vis.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    // remove the '0' value tick from each axis
    vis.selectAll('.tick')
      .each(function (d) {
        if (d === 0) {
          this.remove();
        }
      });

    // Add point circles
    // add circles to each data point along our line and
    // highlight the largest data value using color and size
    vis.selectAll('.point')
      .data(data)
    .enter().append('svg:circle')
      .attr('class', function (d) {
        return (d === max) ? 'point max' : 'point';
      })
      .attr('cx', function (d, i) { return x(i); })
      .attr('cy', function (d) { return y(d); })
      .attr('r', function (d) { return (d === max) ? 6 : 4; })
      // For every data point passed in, we check if it is equal to the max,
      // if it is, we add a new class and increase its radius (r) value.
      .on('mouseover', function () { d3.select(this).attr('r', 8); })
      .on('mouseout',  function (d) {
        var size = (d === max) ? 6 : 4;
        d3.select(this).attr('r', size);
      })
      .on('click', function (d, i) { console.log(d, i); });
  };

  // http://blog.visual.ly/how-to-make-choropleth-maps-in-d3/
  var mapTest = function () {
    function candidateIdDecoder(president) {
      // Decode president name based on codes
      // because our data doesn't just give us their names
      if (president === '1701') {
        return 'McCain';
      }
      else if (president === '1918') {
        return 'Obama';
      }
      else {
        return false;
      }
    }

    d3.json('/scripts/data/us-pres.json', function (error, res) {
      var statejson = res;
      var stateData = [];

      // filter data
      $.each(statejson.locals, function (key, data) {
        // Grab the abbreviation of that state
        var stateAbbreviation = data.abbr;

        // Grab the ID of the candidate elected president in that state
        var president = data.races.President[''].final;

        // Create a JSON object containing the state abbreviation
        // and the name of the president who won that state
        var datarow = {'stateAbbr': stateAbbreviation,
          'president': candidateIdDecoder(president)};

        // Add that JSON object to our data
        stateData.push(datarow);
      });

      // set container
      var mapTest = d3.select('.map-test');

      // We are going to use D3 to select all of the path elements on the page.
      // In our case that’s each individual state. We’re going to change the ﬁll
      // attribute based on the ID of that path. So once we encounter the “AL”
      // path, we’re going to look for our “AL” key in the data we made, and then
      // return a different color depending on the candidate associated with that state.
      mapTest.selectAll('path').attr('fill', function () {
        // Get the ID of the path we are currently working with
        // Our SVG uses the state abbreviation for the ID
        var abbr = this.id;
        var statePresident;

        if (abbr === 'MI-' || abbr === 'SP-') {
          abbr = 'MI';
        }

        // Loop through the state data looking for
        // a match for that abbreviation
        // Then returning the corresponding president
        // who won that state, from the array we made earlier
        $.each(stateData, function (key, data) {
          if (data.stateAbbr === abbr) {
            statePresident = data.president;
          }
        });

        // Return colors
        // based on data
        if (statePresident === 'Obama') {
          return 'blue';
        } else if (statePresident === 'McCain') {
          return 'red';
        } else {
          return '#CCC';
        }
      });
    });
  };

  var internetPenetrationMap = function () {
    d3.json('/scripts/data/internet-penetration.json', function (error, data) {
      // set data
      var countries = data.countries;

      // set container
      var container = d3.select('.internet-penetration');
      var map = container.select('svg');

      var opacityScale = function (val) {
        if (val >= 0.8) {
          return 1;
        } else if (val < 0.8 && val >= 0.6) {
          return 0.8;
        } else if (val < 0.6 && val >= 0.4) {
          return 0.6;
        } else if (val < 0.4 && val >= 0.2) {
          return 0.4;
        } else {
          return 0.2;
        }
      };

      map.selectAll('path')
        .attr('fill', function () {
          // get country name
          var country = this.id;
          // default to grey fill
          var fillColor = false;

          $.each(countries, function (key, data) {
            if (data.name === country) {
              fillColor = true;
            }
          });

          return (fillColor) ? 'red' : '#EEE';
        })
        .attr('opacity', function () {
          // get country name
          var country = this.id;
          var fillOpacity = 1;

          $.each(countries, function (key, data) {
            if (data.name === country) {
              fillOpacity = opacityScale(data.value);
            }
          });

          return fillOpacity;
        });

      /*container.select('svg').append('g')
        .attr('class', 'label usa')
        .attr('tansform', function () {
          debugger;
        });
      container.select('svg').append('g').attr('class', 'label norway');
      container.select('svg').append('g').attr('class', 'label morocco');
      container.select('svg').append('g').attr('class', 'label jamaica');
      container.select('svg').append('g').attr('class', 'label india');

      var usa = map.select('.usa');
      var norway = map.select('.norway');
      var morocca = map.select('.morocca');
      var jamaica = map.select('.jamaica');
      var india = map.select('.india');

      usa.append('text')
        .attr('class', 'country')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'middle')
        .text('USA');

      usa.append('text')
        .attr('class', 'value')
        .text((countries.usa.value * 100) + '%');

      usa.append('rect')
        .attr('height', 20)
        .attr('width', 1);*/

      /*var transformLabel = function (country) {
        // position of parent 'g' element
        var label = countries[country].label;
console.log('translate(' + label.x + ', ' + label.y + ')');
        return 'translate(' + label.x + ', ' + label.y + ')';
      };

      var getLabelText = function () {
        return d3.select(this.parentNode.parentNode).attr('class');
      };

      var labels = map.selectAll('g')[0];

      for (var i = 0; i < labels.length; i++) {
        var label = d3.select(labels[i]);
        var country = label.attr('class');

        label.append('g')
          .attr('class', 'label ' + country)
          .attr('transform', function () {
            transformLabel(country);
          });

        var countryLabel = d3.select('.' + country);

        countryLabel.append('text')
          .text(getLabelText);
      }*/

      var labels = map.selectAll('g')
        .data(countries)
        .enter()
        .append('g')
          .attr('class', function (d) {
            return 'label ' + d.name;
          })
          .attr('transform', function (d) {
            return 'translate(' + d.label.x + ', ' + d.label.y + ')';
          });

      labels.append('text')
        .attr('class', 'label__country')
        .text(function (d) {
          return d.displayName;
        });

      labels.append('text')
        .attr('class', 'label__value')
        .attr('opacity', function (d) {
          return opacityScale(d.value);
        })
        .attr('transform', 'translate(0, 20)')
        .text(function (d) {
          return (d.value * 100).toPrecision(3) + '%';
        });

      labels.append('rect')
        .attr('height', 20)
        .attr('width', 1)
        .attr('transform', function (d) {
          var bar = d.label.bar;
          return 'translate(' + bar.x + ', ' + bar.y + ') rotate(' + bar.rotate + ')';
        });

    });
  };

  // init
  barChartExampleBasic();
  barChartExampleSvg();
  barChartExampleSvgVertical();
  lineGraph();
  mapTest();
  internetPenetrationMap();
});
