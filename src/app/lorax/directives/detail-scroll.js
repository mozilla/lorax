/**
 * @fileOverview Detail page scroll directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery'], function ($) {
  'use strict';

  /**
   * Detail Scroll directive
   */
  var DetailScrollDirective = function () {
    return {
      restrict: 'A',
      scope: true,
      controller: DetailScrollCtrl,
      link: DetailScrollLinkFn
    };
  };

  /**
   * Controller for detail scroll directive
   * @constructor
   */
  var DetailScrollCtrl = function (
    $scope,
    windowService
  ) {

    this._$scope = $scope;

    $scope.$on('$destroy', function () {
      windowService.setTrafficLightMode(false);
    });
  };

  DetailScrollCtrl.$inject = [
    '$scope',
    'windowService'
  ];

  /**
   * Link function for Detail Page Scroll directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      Detail wrapper jQuery element.
   */
  var DetailScrollLinkFn = function (scope, iElem) {
    // switch body background color depending on current issue
    // TODO: needs work, especially timing of transition relative to scroll
    var $win = $(window);
    var $body = $('body');

    var getBodyBgColor = function () {
      var windowTop = $win.scrollTop();
      var windowHeight = $win.height();
      var bodyOffset = $(iElem).position().top;

      $('.detail').each(function () {
        var $this = $(this);
        var status = $this.attr('data-status');
        //var height = $this.height();
        var top = $this.position().top - bodyOffset;
        var on = top - (windowHeight / 2);
        //var off = on + height;

        //console.log(i, top, on, off);

        if (windowTop > on) {
          $body.attr('data-bg-mode', status);
        }
      });
    };

    // init
    getBodyBgColor();

    // scroll handler
    $win.on('scroll', getBodyBgColor);
  };

  return DetailScrollDirective;
});
