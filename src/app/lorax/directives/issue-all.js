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
    $location,
    dataService,
    windowService
  ) {

    this._$scope = $scope;
    this._$route = $route;
    this._$timeout = $timeout;
    this._$rootScope = $rootScope;
    this._$location = $location;
    this._$scope.dataService = dataService;
    this._$scope.detail = {
      currentIssue : ""
    };

    $scope.$on('$destroy', function () {
      windowService.setTrafficLightMode(false);
    });

    this._$scope.dataService.getMain().then(function(model) {
        this._$scope.detail.model = model;
    }.bind(this));
    
    this._$scope.detail.scrollTo = function(issue) {
      $('body').animate({
        scrollTop: $('#' + issue).offset().top - 138
      }, 500);
    }.bind(this);

    this._$scope.detail.nextIssue = function() {
      this._$scope.detail.currentIssue = $('#' + this._$scope.detail.currentIssue).next().attr('id');
      if (this._$scope.detail.currentIssue) {
        this._$scope.detail.scrollTo(this._$scope.detail.currentIssue);
      } 
    }.bind(this);
  };

  IssueAllCtrl.$inject = [
    '$scope',
    '$route',
    '$timeout',
    '$rootScope',
    '$location',
    'dataService',
    'windowService'
  ];

  /**
   * Link function for Issue All directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      Detail wrapper jQuery element.
   */
  var IssueAllLinkFn = function (scope, iElem, iAttrs, controller) {

    controller._$timeout(function() {

      var topic = controller._$location.search().topic;
      var issue = controller._$location.search().issue;

      if (topic) {
        if ( !issue ) {
          issue = controller._$scope.detail.model.getTopicById(topic).getIssues()[0].getId();
        }
        controller._$scope.detail.scrollTo(issue);
        controller._$scope.detail.currentIssue = issue;
      }

      var routeChange = controller._$rootScope.$on('$routeUpdate', function(evt, newParam) {
        topic = newParam.params.topic;
        issue = newParam.params.issue;
          
        if (topic) {
          if ( !issue ) {
            issue = controller._$scope.detail.model.getTopicById(topic).getIssues()[0].getId();
          }
          controller._$scope.detail.scrollTo(issue);

          controller._$scope.detail.currentIssue = issue;
        } else {
          $('body').animate({
            scrollTop: 0
          });
          controller._$scope.detail.currentIssue = "";
        }
      }.bind(controller));

      controller._$scope.$on('$destroy', routeChange);

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

    }.bind(controller), 500);
  };

  return IssueAllDirective;
});
