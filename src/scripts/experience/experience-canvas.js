/* global define:true */
define([
    'jquery',
    'pixi',
    'signals',
    'gs',
    'modernizr',
    'experience/issue',
    'experience/circle',
    'experience/responsive',
    'jquery-mobile'
], function (
    $,
    PIXI,
    signals,
    gs,
    Modernizr,
    Issue,
    Circle,
    Responsive
) {
    'use strict';

    var ExperienceCanvas = function () {
        this.issues = [];
        this.tags = [];
        this.fakes = [];

        this.canvasSize = new PIXI.Point();

        this.renderStartS = new signals.Signal();
        this.renderEndS = new signals.Signal();

        this.touchStartS = new signals.Signal();
        this.swipeLeftS = new signals.Signal();
        this.swipeRightS = new signals.Signal();
        this.pressIssueS = new signals.Signal();

        return this;
    };

    /**
    * Sets HTML element for PIXI container
    * @param  {object} DOM object
    */
    ExperienceCanvas.prototype.init = function (container) {
        Responsive.RATIO = window.devicePixelRatio;
        // Responsive.RATIO = 2;
        Responsive.SIZE = new PIXI.Point(container.width(), container.height());
        Responsive.IS_TOUCH = Modernizr.touch;

        this.canvasSize = Responsive.SIZE;

        // create pixijs renderer and stage
        this._renderer = new PIXI.CanvasRenderer(
            this.canvasSize.x,
            this.canvasSize.y,
            {transparent: true, antialias: true, resolution: Responsive.RATIO});
        this._stage = new PIXI.Stage();
        this._stage.interactive = true;
        container.append(this._renderer.view);

        if (Responsive.RATIO !== 1) {
            this._renderer.view.style.width = '100%';
        }

        // lines
        this._linesContainer = new PIXI.Graphics();
        this._linesContainer.x = Math.round(Responsive.SIZE.x / 2);
        this._linesContainer.y = Math.round(Responsive.SIZE.y / 2);
        this._stage.addChild(this._linesContainer);

        // particles
        this._particlesContainer = new PIXI.DisplayObjectContainer();
        this._particlesContainer.interactive = true;
        this._particlesContainer.x = this._linesContainer.x;
        this._particlesContainer.y = this._linesContainer.y;
        this._stage.addChild(this._particlesContainer);

        // start rendering
        requestAnimationFrame(this._render.bind(this));

        this._drawFakes();

        // touch events
        this._stage.tap = this._stage.touchstart = this._onTouchStart.bind(this);
        $(document).on('swipeleft', container, this._onSwipeLeft.bind(this));
        $(document).on('swiperight', container, this._onSwipeRight.bind(this));
    };

    ExperienceCanvas.prototype.hide = function () {
        if (!this._isHidden) {
            this._stage.removeChild(this._linesContainer);
            this._stage.removeChild(this._particlesContainer);
        }
        this._isHidden = true;
    };

    ExperienceCanvas.prototype.show = function () {
        if (this._isHidden) {
            this._stage.addChild(this._linesContainer);
            this._stage.addChild(this._particlesContainer);
        }
        this._isHidden = false;
    };

    /**
    * Draw fake circles on canvas
    */
    ExperienceCanvas.prototype._drawFakes = function () {
        var circle;
        for (var i = 0; i < 200; i ++) {
            circle = new Circle();

            this.fakes.push(circle);
            this._particlesContainer.addChild(circle.elm);

            circle.draw(1);
            circle._circle.alpha = 0.3;
            circle.elm.alpha = 0;
        }
    };

    /**
    * Draw tags on canvas
    */
    ExperienceCanvas.prototype.drawTags = function (tagData) {
        this._tagData = tagData;

        var tag;
        var i;
        var j;
        for (i = 0; i < this._tagData.length; i ++) {
            for (j = 0; j < 3; j ++) { // multiply current tags
                tag = new Issue(i, this.canvasSize);
                tag.setIsInteractive(false);
                tag.initRadius = 2;

                this.tags.push(tag);
                this._particlesContainer.addChild(tag.elm);

                tag.setData(this._tagData[i]);
                tag.draw(tag.initRadius);
                tag.pressS.add(this._onPressIssue.bind(this));
                tag.elm.alpha = 0;
            }
        }
    };

    /**
    * Draw issues on canvas
    */
    ExperienceCanvas.prototype.drawIssues = function (issueData) {
        this._issueData = issueData;

        var issue;
        for (var i = 0; i < this._issueData.length; i ++) {
            issue = new Issue(i, this.canvasSize);
            issue.initRadius = 5;
            this.issues.push(issue);
            this._particlesContainer.addChild(issue.elm);

            issue.setData(this._issueData[i]);
            issue.draw(issue.initRadius);
            issue.pressS.add(this._onPressIssue.bind(this));
        }
    };

    ExperienceCanvas.prototype._onPressIssue = function (issue) {
        this.pressIssueS.dispatch(issue);
    };

    ExperienceCanvas.prototype.addChild = function (child) {
        this._stage.addChild(child);
    };

    ExperienceCanvas.prototype.removeChild = function (child) {
        this._stage.removeChild(child);
    };

    /**
     * update particle positions
     */
    ExperienceCanvas.prototype._updateParticles = function () {
        var i;

        for (i = 0; i < this.issues.length; i ++) {
            this.issues[i].update(this.mousePosition);
            this.issues[i].setRadius();
        }

        for (i = 0; i < this.tags.length; i ++) {
            this.tags[i].update(this.mousePosition);
        }
    };

    /**
     * Clear lines from canvas
     */
    ExperienceCanvas.prototype.clearLines = function () {
        this._linesContainer.clear();
    };

    /**
     * Hide lines container
     */
    ExperienceCanvas.prototype.hideLines = function () {
        gs.TweenMax.to(this._linesContainer, 0.3, {alpha: 0, overwrite: true});
    };

    /**
     * Show lines container
     */
    ExperienceCanvas.prototype.showLines = function () {
        gs.TweenMax.to(this._linesContainer, 0.3, {alpha: 1, overwrite: true});
    };

    /**
     * Draw a line on canvas
     * @param  {Circle} issue origin particle
     * @param  {Circle} related destination particle
     * @param  {Number} color line color
     * @param  {Number} alpha line alpha
     */
    ExperienceCanvas.prototype.drawLine = function (issue, related, color, alpha) {
        this._linesContainer.lineStyle(1, color,  alpha);
        this._linesContainer.moveTo(issue.elm.x, issue.elm.y);
        this._linesContainer.lineTo(related.elm.x, related.elm.y);
    };

    /**
    * Get visual element from id
    */
    ExperienceCanvas.prototype.getElementByData = function (data) {
        if (data.elm) {
            return data.elm;
        }

        var i;

        for (i = 0; i < this.issues.length; i ++) {
            if (this.issues[i].data._id === data._id) {
                data.elm = this.issues[i];
                return this.issues[i];
            }
        }

        for (i = 0; i < this.tags.length; i ++) {
            if (this.tags[i].data._id === data._id) {
                data.elm = this.tags[i];
                return this.tags[i];
            }
        }
    };

    ExperienceCanvas.prototype._onTouchStart = function (event) {
        this._touchPosition = event.global;
        this._updateMousePosition();
        this.touchStartS.dispatch();
    };

    ExperienceCanvas.prototype._onSwipeLeft = function () {
        this.swipeLeftS.dispatch();
    };

    ExperienceCanvas.prototype._onSwipeRight = function () {
        this.swipeRightS.dispatch();
    };

    /**
     * Updates _mousePosition
     */
    ExperienceCanvas.prototype._updateMousePosition = function () {
        // mouse position
        var mousePosition = this._stage.getMousePosition().clone();

        // get position from touch if theres one
        if (this._touchPosition) {
            mousePosition = this._touchPosition.clone();
        }

        // make it relative to container
        mousePosition.x -= this._particlesContainer.x;
        mousePosition.y -= this._particlesContainer.y;

        if (this.autoModePosition) {
            mousePosition = this.autoModePosition.clone();
        }

        this.mousePosition = mousePosition;
    };

    /**
     * do render cycle
     */
    ExperienceCanvas.prototype._render = function () {
        this.renderStartS.dispatch();

        // update elements
        this._updateMousePosition();
        this._updateParticles();

        // render canvas
        this._renderer.render(this._stage);
        requestAnimationFrame(this._render.bind(this));

        this.renderEndS.dispatch();
    };

    return ExperienceCanvas;
});
