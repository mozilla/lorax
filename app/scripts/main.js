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
});
