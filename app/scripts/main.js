'use strict';

require(['jquery', 'd3'], function ($, d3) {
  // Decentralized Power
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

  // Longest terms and conditions
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

  // Common spoken and internet languages
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


  // Increasing lobbying costs
  /*var lobbyingCosts = function () {
    var margin = {top: 48, right: 12, bottom: 88, left: 24};
    var width = 600 - margin.left - margin.right;
    var height = 540 - margin.top - margin.bottom;

    var x = d3.scale.linear()
      .range([0, width]);

    var y = d3.scale.linear()
      .range([height, 0]);

    //var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    var line = d3.svg.line()
      .interpolate('basis')
      .x(function (d) { return x(d.year); })
      .y(function (d) { return y(d.revolvers); });

    var svg = d3.select('.lobbying-costs').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    d3.json('/scripts/data/lobbying-costs.json', function (error, res) {
      var data = res.lobbyingCosts;

      var varNames = d3.keys(data[0])
        .filter(function (key) { console.log(key) });



      var lobbying = chart.selectAll('g')
        .data(data)
        .enter()
        .append('g');

      lobbying.append('td')
        .text(function (d) {
          //return d.spoken.pct + '%';
        });
    });
  };

  // init
  lobbyingCosts();*/


  // switch body background color depending on current issue
  // TODO: needs work, especially timing of transition relative to scroll
  var $win = $(window);
  var $body = $('body');

  var getBodyBgColor = function () {
    var windowTop = $win.scrollTop();
    var windowHeight = $win.height();
    var bodyOffset = $('.main--detail').position().top;

    $('.detail').each(function (i) {
      var $this = $(this);
      var status = $this.attr('data-status');
      var bodyClass = 'is-' + status;
      var height = $this.height();
      var top = $this.position().top - bodyOffset;
      var on = top - (windowHeight / 2);
      var off = on + height;

      //console.log(i, top, on, off);

      if (windowTop > off) {
        $body.removeClass(bodyClass);
      } else if (windowTop > on) {
        $body.addClass(bodyClass);
      }
    });
  };

  // init
  getBodyBgColor();

  // scroll handler
  $win.on('scroll', getBodyBgColor);
});
