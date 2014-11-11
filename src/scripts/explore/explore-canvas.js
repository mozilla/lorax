/* global define:true */
define([
    'pixi',
    'createjs',
    'explore/issue',
    'explore/circle'
], function (
    PIXI,
    createjs,
    Issue,
    Circle
) {
    'use strict';

    var ExploreCanvas = function () {
        this.issues = [];
        this.tags = [];
        this.fakes = [];

        this.canvasSize = new PIXI.Point();
    };

    /**
    * Sets HTML element for PIXI container
    * @param  {object} DOM object
    */
    ExploreCanvas.prototype.init = function (container) {
        this._lastTick = 0;
        this.canvasSize.x = container.width();
        this.canvasSize.y = container.height();

        // create pixijs renderer and stage
        this._renderer = new PIXI.CanvasRenderer(
            this.canvasSize.x,
            this.canvasSize.y,
            {transparent: true, antialias: true});
        this._stage = new PIXI.Stage();
        this._stage.interactive = true;
        container.append(this._renderer.view);

        // lines
        this._linesContainer = new PIXI.Graphics();
        this._linesContainer.x = Math.round(this._renderer.width / 2);
        this._linesContainer.y = Math.round(this._renderer.height / 2);
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
    };

    /**
    * Draw fake circles on canvas
    */
    ExploreCanvas.prototype._drawFakes = function () {
        var seed;
        var rSeed;
        var circle;
        for (var i = 0; i < 200; i ++) {
            seed = Math.random() * Math.PI * 2;
            rSeed = Math.pow(Math.random(), 1/3) * (this._exploreRadius - 20);

            circle = new Circle();

            this.fakes.push(circle);
            this._particlesContainer.addChild(circle.elm);

            circle.draw(1, Math.sin(seed) * rSeed, Math.cos(seed) * rSeed);
            circle.elm.alpha = 0.1 + (0.3 * rSeed / this._exploreRadius);
        }
    };

    /**
    * Draw tags on canvas
    */
    ExploreCanvas.prototype.drawTags = function (tagData) {
        this._tagData = tagData;

        var seed;
        var rSeed;
        var tag;
        for (var i = 0; i < this._tagData.length; i ++) {
            seed = Math.random() * Math.PI * 2;
            rSeed = this._exploreRadius + (Math.random() * 5);

            tag = new Issue(i, this.canvasSize);
            tag.setIsInteractive(false);

            this.tags.push(tag);
            this._particlesContainer.addChild(tag.elm);

            tag.setData(this._tagData[i]);
            tag.draw(2, Math.sin(seed) * rSeed, Math.cos(seed) * rSeed);

            // tag.elm.mouseover = this._onOverTag.bind(this);
            // tag.elm.mouseout = this._onOutTag.bind(this);
            // tag.elm.mousedown = this._onPressIssue.bind(this);
        }
    };

    /**
    * Draw issues on canvas
    */
    ExploreCanvas.prototype.drawIssues = function (issueData) {
        this._issueData = issueData;

        var seed;
        var rSeed;
        var issue;
        for (var i = 0; i < this._issueData.length; i ++) {
            seed = Math.random() * Math.PI * 2;
            rSeed = Math.pow(Math.random(), 1/2) * (this._exploreRadius - 20);

            issue = new Issue(i, this.canvasSize);

            this.issues.push(issue);
            this._particlesContainer.addChild(issue.elm);

            issue.setData(this._issueData[i]);
            issue.draw(
                8 - rSeed / this._exploreRadius * 5,
                Math.sin(seed) * rSeed,
                Math.cos(seed) * rSeed
            );

            // issue.exploreX = issue.elm.x;
            // issue.exploreY = issue.elm.y;

            // issue.mouseOverCallback = this._mouseOverIssue.bind(this);
            // issue.mouseOutCallback = this._mouseOutIssue.bind(this);

            // issue.elm.mouseover = issue.elm.touchstart = this._onOverIssue.bind(this);
            // issue.elm.mouseout = this._onOutIssue.bind(this);
            // issue.elm.mousedown = this._onPressIssue.bind(this);
        }
    };

    /**
     * update particle positions
     */
    ExploreCanvas.prototype._updateParticles = function (mousePosition) {
        for (var i = 0; i < this.issues.length; i ++) {
            this.issues[i].update(mousePosition);
        }

        for (var i = 0; i < this.tags.length; i ++) {
            this.tags[i].update(mousePosition);
        }
    };

    /**
    * Draw connecting lines
    */
    ExploreCanvas.prototype._drawLines = function () {
        // this._linesContainer.clear();
        // var isOver;
        // var isSameTopic;
        // var issue;
        // var related;
        // var tags;
        // var relatedItem;
        // var i;
        // var j;
        // for (i = 0; i < this.issues.length; i ++) {
        //     issue = this.issues[i];
        //     related = this.issues[i].data.getRelated();
        //     tags = this.issues[i].data.getTags();

        //     if (this._mode === Issue.MODE_EXPLORE || this._mode === Issue.MODE_TOPICS) {
        //         for (j = 0; j < related.length; j ++) {
        //             relatedItem = this._getElementFromId(related[j]._id);

        //             isOver = (issue.isOver || relatedItem.isOver);
        //             isSameTopic = issue.data._parent._id === relatedItem.data._parent._id;
        //             // only show related on same topic if on topics
        //             if (this._mode === Issue.MODE_EXPLORE || isSameTopic) {
        //                 if (isOver && this._mode !== Issue.MODE_TOPICS) {
        //                     this._linesContainer.lineStyle(1, 0x000000,  0.15);
        //                 } else {
        //                     this._linesContainer.lineStyle(1, 0x000000, 0.03);
        //                 }

        //                 this._linesContainer.moveTo(issue.elm.x, issue.elm.y);
        //                 this._linesContainer.lineTo(relatedItem.elm.x, relatedItem.elm.y);
        //             }
        //         }
        //     }

        //     // connect to tags on explore
        //     if (this._mode === Issue.MODE_EXPLORE) {
        //         for (j = 0; j < tags.length; j ++) {
        //             relatedItem = this._getElementFromId(tags[j]._id);

        //             isOver = (issue.isOver || relatedItem.isOver);
        //             if (isOver) {
        //                 this._linesContainer.lineStyle(1, 0x000000,  0.15);
        //             } else {
        //                 this._linesContainer.lineStyle(1, 0x000000, 0.03);
        //             }

        //             this._linesContainer.moveTo(issue.elm.x, issue.elm.y);
        //             this._linesContainer.lineTo(relatedItem.elm.x, relatedItem.elm.y);
        //         }
        //     }

        //     // connect to next in line on issues
        //     if (this._mode === Issue.MODE_ISSUES && i < this.issues.length - 1) {
        //         relatedItem = this.issues[i + 1];
        //         this._linesContainer.lineStyle(1, 0x000000, 0.15);
        //         this._linesContainer.moveTo(issue.elm.x, issue.elm.y);
        //         this._linesContainer.lineTo(relatedItem.elm.x, relatedItem.elm.y);
        //     }
        // }
    };

    /**
     * do render cycle
     */
    ExploreCanvas.prototype._render = function (tick) {
        // update tween tick
        createjs.Tween.tick(tick - this._lastTick);
        this._lastTick = tick;

        // mouse position
        var mousePosition = this._stage.getMousePosition().clone();

        // get position from touch if theres one
        if (this._touchPosition) {
            mousePosition = this._touchPosition.clone();
        }

        // make it relative to container
        mousePosition.x -= this._particlesContainer.x;
        mousePosition.y -= this._particlesContainer.y;

        var lastMouse = this._mousePosition;
        this._mousePosition = mousePosition.clone();

        this._updateParticles(mousePosition);

        this._drawLines();
        this._renderer.render(this._stage);

        requestAnimationFrame(this._render.bind(this));
    };

    return ExploreCanvas;
});