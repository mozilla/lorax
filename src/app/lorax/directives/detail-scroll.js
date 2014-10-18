/**
 * @fileOverview Detail page scroll directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery', 'jquery-scrollie'], function ($) {
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
    $timeout,
    windowService
  ) {

    this._$scope = $scope;
    this._$timeout = $timeout;

    $scope.$on('$destroy', function () {
      windowService.setTrafficLightMode(false);
    });
  };

  DetailScrollCtrl.$inject = [
    '$scope',
    '$timeout',
    'windowService'
  ];

  /**
   * Link function for Detail Page Scroll directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      Detail wrapper jQuery element.
   */
  var DetailScrollLinkFn = function (scope, iElem, iAttrs, controller) {

    controller._$timeout(function () {
      var $body = $('body');
      var $detail = $('.detail');
      var status = $detail.eq(0).attr('data-issue-status');

      $body.attr('data-bg-mode', status);

      $detail.scrollie({
        scrollOffset : -100,
        scrollingInView : function (elem) {
          status = elem.attr('data-issue-status');

          $body.attr('data-bg-mode', status);
        }
      });
    }, 500);
  };

  return DetailScrollDirective;
});
