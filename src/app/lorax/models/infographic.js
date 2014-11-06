define(['d3'], function (d3) {
  'use strict';

  var InfographicModel = function (id, type, data) {
    this._id = id;
    this._type = type;
    this._header = data.header;
    this._subheader = data.subheader;
    this._dataPoints = data.dataPoints;
    this._source = data.source;

    // this._draw = {
    //   "line-graph": function () {
    //     this.drawLineGraph();
    //   },
    //   "bar-graph": function () {
    //     this.drawBarGraph();
    //   },
    //   "map": function () {
    //     this.drawMap();
    //   },
    //   "static-image": function () {
    //     this.drawStaticImage();
    //   }
    // }
  };

  InfographicModel.prototype.getId = function () {
    return this._id;
  };

  InfographicModel.prototype.getType = function () {
    return this._type;
  };

  InfographicModel.prototype.getHeader = function () {
    return this._header;
  };

  InfographicModel.prototype.getSubheader = function () {
    return this._subheader;
  };

  InfographicModel.prototype.getDataPoints = function () {
    return this._dataPoints;
  };

  InfographicModel.prototype.getSourceName = function () {
    return this._source.name;
  };

  InfographicModel.prototype.getSourceLocation = function () {
    return this._source.src;
  };

  InfographicModel.prototype.drawInfographic = function () {
    // console.log(this._id);
    switch ( this._type ) {
    case 'line-graph':
      this.drawLineGraph();
      break;

    case 'bar-graph':
      this.drawBarGraph();
      break;

    case 'map':
      this.drawMap();
      break;

    case 'static-image':
      this.drawStaticImage();
      break;
    }
    // console.log(this._drawingFunctions[this._type]);
    // var draw = {
    //   "line-graph": function () {
    //     return this.drawLineGraph();
    //   },
    //   "bar-graph": function () {
    //     return this.drawBarGraph();
    //   }
    // }


  };

  InfographicModel.prototype.drawBarGraph = function () {
    var data = this._dataPoints.internetCompaniesByRevenue;
    var chart = d3.select('#' + this._id + ' .infographic__wrapper' + ' div');

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
  };

  InfographicModel.prototype.drawLineGraph = function () {
    var data = this._dataPoints.termsAndConditions;
    var chart = d3.select('#' + this._id + ' .infographic__wrapper div');

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

    $('#' + this._id + ' .terms-company__stacks').each(function (idx) {
      var $this = $(this);
      var length = data[idx].length;
      var numBars = Math.round(length / 2000);

      for (var i = 0; i < numBars; i++) {
        $this.append('<div class="stacks-item"></div>');
      }
    });
  };

  InfographicModel.prototype.drawMap = function () {
    console.log("drawing map here");
  };

  InfographicModel.prototype.drawStaticImage = function () {
    console.log("drawing static image here");
  };

  return InfographicModel;
});

