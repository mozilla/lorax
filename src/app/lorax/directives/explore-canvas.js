/**
 * @fileOverview Explore canvas directive
 * @author <a href="mailto:leandroferreira@moco.to">Leandro Ferreira</a>
 */
define(['explore/explore'], function (Explore) {
  'use strict';

  /**
   * directive
   */
  var ExploreCanvasDirective = function () {
    return {
      restrict: 'A',
      replace: true,
      controller: ExploreCanvasController,
      link: ExploreCanvasLinkFn,
      template: '<div id="explore"></div>'
    };
  };

  /**
   * Controller for explore canvas directive
   * @constructor
   */
  var ExploreCanvasController = function (
    $scope
    )
  {
    this._$scope = $scope;

    this._explore = new Explore();
    this._explore.init(true);
  };

  /**
   * Array of dependencies to be injected into controller
   * @type {Array}
   */
  ExploreCanvasController.$inject = [
    '$scope'
  ];

  /**
   * Link function
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ExploreCanvasLinkFn = function (scope, iElem, iAttrs, controller) {
    controller._explore.setContainer(iElem);
  };

  return ExploreCanvasDirective;
});
