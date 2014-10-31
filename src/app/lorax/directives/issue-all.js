/**
 * @fileOverview Issue all directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery', 'jquery-scrollie'], function ($) {
  'use strict';

  /**
   * Issue All directive
   */
  var IssueAllDirective = function () {
    return {
      restrict: 'A',
      scope: true,
      controller: IssueAllCtrl,
      link: IssueAllLinkFn,
      templateUrl: '/app/lorax/directives/issue-all.tpl.html'
    };
  };

  /**
   * Controller for issue all directive
   * @constructor
   */
  var IssueAllCtrl = function (
    $scope,
    $route,
    $timeout,
    $rootScope,
    dataService,
    windowService
  ) {

    this._$scope = $scope;
    this._$route = $route;
    this._$timeout = $timeout;
    this._$rootScope = $rootScope;
    this._$scope.dataService = dataService;
    this._$scope.detail = { };

    $scope.$on('$destroy', function () {
      windowService.setTrafficLightMode(false);
    });

    this._$scope.dataService.getMain().then(function(model) {
        this._$scope.detail.model = model;
    }.bind(this));
    

    console.log('issue all');
  };

  IssueAllCtrl.$inject = [
    '$scope',
    '$route',
    '$timeout',
    '$rootScope',
    'dataService',
    'windowService'
  ];

  /**
   * Link function for Issue All directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      Detail wrapper jQuery element.
   */
  var IssueAllLinkFn = function (scope, iElem, iAttrs, controller) {

    var routeChange = controller._$rootScope.$on('$routeUpdate', function(evt, newParam) {
      var topic = newParam.params.topic;
      var issue = newParam.params.issue;
        
      controller._$timeout(function () {
        if (topic) {
          if ( !issue ) {
            issue = controller._$scope.detail.model.getTopicById(topic).getIssues()[0].getId();
          } 
          $('body').animate({
            scrollTop: $('#' + issue).offset().top - 138
          }, 500);

          controller._$scope.detail.active = topic;
        } else {
          $('body').animate({
            scrollTop: 0
          });
        }
      }.bind(controller));
    }.bind(controller));

    controller._$scope.$on('$destroy', routeChange);

    controller._$timeout(function () {
      var $body = $('body');
      var $detail = $('.detail');
      var status = $detail.eq(0).attr('data-issue-status');

      $body.attr('data-bg-mode', status);

      $detail.scrollie({
        scrollOffset : 138,
        ScrollingOutOfView : function (elem) {
          status = elem.attr('data-issue-status');

          $body.attr('data-bg-mode', status);
        }
      });
    }, 500);
  };

  return IssueAllDirective;
});
