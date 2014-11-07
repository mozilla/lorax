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
      link: function postLink(scope, iElement, iAttrs) {
            var directiveType = iAttrs.directiveType;
            iElement.removeAttr('data-lorax-add-infographic-directive');
            iElement.attr(directiveType, '');
            $compile(iElement)(scope);
      }
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
  // var AddInfographicLinkFn = function (scope, iElem, iAttrs, controller) {

  // };

  return AddInfographicDirective;
});