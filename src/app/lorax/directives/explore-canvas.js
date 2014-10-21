/**
 * @fileOverview Explore canvas directive
 * @author <a href="mailto:leandroferreira@moco.to">Leandro Ferreira</a>
 */
define(['pixi', 'stats'], function (PIXI, Stats) {
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

    // FPS count for debugging
    this._stats = new Stats();
    this._showStats();
  };

  /**
   * Array of dependencies to be injected into controller
   * @type {Array}
   */
  ExploreCanvasController.$inject = [
    '$scope'
  ];

  /**
   * Shows FPS count
   */
  ExploreCanvasController.prototype._showStats = function () {
    this._stats.setMode(0);
    this._stats.domElement.style.position = 'absolute';
    this._stats.domElement.style.left = '0px';
    this._stats.domElement.style.top = '0px';
    document.body.appendChild(this._stats.domElement);
  };

  /**
   * Sets HTML element for PIXI container
   * @param  {object} DOM object
   */
  ExploreCanvasController.prototype._setContainer = function (container) {
    // create pixijs renderer and stage
    this._renderer = new PIXI.CanvasRenderer(container.width(), container.height(), null, true, true);
    this._stage = new PIXI.Stage();
    this._stage.interactive = true;
    container.append(this._renderer.view);

    // circles
    var smallerDimension = Math.min(container.width(), container.height());
    this._exploreRadius = smallerDimension / 2;
    this._topicsContainer = new PIXI.DisplayObjectContainer();
    this._topicsContainer.interactive = true;
    this._topicsContainer.x = this._renderer.width / 2;
    this._topicsContainer.y = this._renderer.height / 2;
    this._stage.addChild(this._topicsContainer);

    // lines
    this._linesContainer = new PIXI.Graphics();
    this._linesContainer.x = this._topicsContainer.x;
    this._linesContainer.y = this._topicsContainer.y;
    this._stage.addChild(this._linesContainer);

    this._drawTopics();

    // start animation
    requestAnimationFrame(this._animate.bind(this));
  };

  /**
   * Draw topics on canvas
   */
  ExploreCanvasController.prototype._drawTopics = function () {
    var seed, rSeed;
    for (var i = 0; i < 30; i ++) {
      seed = Math.random() * Math.PI * 2;
      rSeed = Math.pow(Math.random(), 1/3) * (this._exploreRadius - 50);

      var circle = this._drawCircle(15 - rSeed / this._exploreRadius * 12, Math.sin(seed) * rSeed, Math.cos(seed) * rSeed);
      circle.i = i;

      // circles.push(circle);
      this._topicsContainer.addChild(circle);

      // circle.mouseover = circle.touchstart = onMouseOverCircle;
      // circle.mouseout = circle.touchend = circle.touchendoutside = onMouseOutCircle;
    }
  };

  /**
   * Draws a single circle
   * @param  {number} radius circle radius
   * @param  {number} x initial position on x axis
   * @param  {number} y initial position on y axis
   * @return {DisplayObject} actual element
   */
  ExploreCanvasController.prototype._drawCircle = function (radius, x, y) {
    var circle = new PIXI.Graphics();
    circle.beginFill(0x000000);
    circle.drawCircle(0, 0, radius);
    circle.endFill();
    circle.hitArea = new PIXI.Rectangle(-radius, -radius, radius * 2, radius * 2);
    circle.cacheAsBitmap = true;
    circle.interactive = true;
    circle.buttonMode = true;
    circle.aX = (Math.random() * 5) + 4;
    circle.pX = (Math.random() * 1) + 0.5;
    circle.tX = 0;
    circle.aY = (Math.random() * 5) + 4;
    circle.pY = (Math.random() * 1) + 0.5;
    circle.tY = 0;
    circle.related = [Math.floor(Math.random() * 30)];
    circle.x = circle.x0 = x;
    circle.y = circle.y0 = y;
    return circle;
  };

  ExploreCanvasController.prototype._animate = function () {
    this._stats.begin();
    // updatePositions();
    // drawLines();
    this._renderer.render(this._stage);
    this._stats.end();
    requestAnimationFrame(this._animate.bind(this));
  };

  /**
   * Link function
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ExploreCanvasLinkFn = function (scope, iElem, iAttrs, controller) {
    controller._setContainer(iElem);
  };

  return ExploreCanvasDirective;
});
