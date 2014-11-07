/**
 * @fileOverview Add Infograhpic directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define([], function () {
  'use strict';

  /**
   * Issue Details directive
   */
  var AddInfographicDirective = function ($compile) {
    return {
      restrict: 'A',
      scope: true,
      // compile: function compile(tElement, tAttrs) {
      //   console.log(tAttrs);
      //   var directiveGetter = tAttrs.directiveType;

      //   return function postLink(scope, element) {  
      //       element.removeAttr('data-lorax-add-infographic-directive');
      //       // element.attr(directiveGetter, '');
      //       // $compile(element)(scope);
      //   };
      // },
      controller: AddInfographicController,
      link: AddInfographicLinkFn
    };
  };

  /**
   * Controller for detail directive
   * @constructor
   */
  var AddInfographicController = function (
    $scope,
    $compile
    )
  {
    this._$scope = $scope;
    this._$compile = $compile;
  };

  /**
   * Array of dependencies to be injected into controller
   * @type {Array}
   */
  AddInfographicController.$inject = [
    '$scope',
    '$compile'
  ];

  /**
   * Link function for Detail Section directive
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var AddInfographicLinkFn = function (scope, iElem, iAttrs, controller) {
      var directiveType = iAttrs.directiveType;
      iElem.removeAttr('data-lorax-add-infographic-directive');
      iElem.attr(directiveType, '');
      controller._$compile(iElem)(scope);
  };

  return AddInfographicDirective;
});