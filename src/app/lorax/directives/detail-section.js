/**
 * @fileOverview Detail section directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define([], function (IssueModel) {
  'use strict';

  /**
   * Detail Section directive
   */
  var DetailSectionDirective = function () {
    return {
      restrict: 'A',
      replace: true,
      transclude: true,
      scope: {
        'inverted': '@',
        'issueStatus': '@',
        'issueName': '@'
      },
      controller: DetailSectionController,
      link: DetailSectionLinkFn,
      templateUrl: '/app/lorax/directives/detail-section.tpl.html'
    };
  };

  /**
   * Controller for detail directive
   * @constructor
   */
  var DetailSectionController = function (
    $scope,
    dataService
    )
  {
    this._$scope = $scope;

    this._$scope.detailSection = {
      inverted: $scope.inverted,
      status: $scope.issueStatus
    };

    dataService.getMain().then(function(model) {
      this._$scope.issue = model.getIssueById($scope.issueName);
    }.bind(this));
  };

  /**
   * Array of dependencies to be injected into controller
   * @type {Array}
   */
  DetailSectionController.$inject = [
    '$scope',
    'dataService'
  ];

  /**
   * Doesn't really do anything
   * @param  {string}          No parameters
   * @return {string}          No return value
   */
  DetailSectionController.prototype.testMethod = function () {
    console.log('test');
  };

  /**
   * Link function for Detail Section directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var DetailSectionLinkFn = function (scope, iElem, iAttrs, controller) {
    console.log(controller);
  };

  return DetailSectionDirective;
});
