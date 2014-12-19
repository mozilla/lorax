/* global define:true */
define([
    'experience/circle',
    'experience/responsive',
    'pixi',
    'signals',
    'gs'
], function (
    Circle,
    Responsive,
    PIXI,
    signals,
    gs
) {
    'use strict';

    var Issue = function (index, canvasSize) {
        this.mouseEnabled = true;
        this._index = index;
        this._canvasSize = canvasSize;
        this.elm = new PIXI.DisplayObjectContainer();

        this.mouseOverS = new signals.Signal();
        this.mouseOutS = new signals.Signal();
        this.pressS = new signals.Signal();
        this.tapS = new signals.Signal();

        this._tagStyle = {font: '400 8px "Fira Sans", sans-serif', fill: '#222222'};
        this._tagTitleStyle = {font: '400 14px "Fira Sans", sans-serif', fill: '#FFFFFF'};
        this._titleOverStyle = {font: '400 14px "Fira Sans", sans-serif', fill: '#222222'};
        this._topicStyle = {font: '200 12px "Fira Sans", sans-serif', fill: '#222222'};
        this._issuesStyle = {font: '200 20px "Fira Sans", sans-serif', fill: '#222222'};
        this._tagIssuesStyle = {font: '200 20px "Fira Sans", sans-serif', fill: '#FFFFFF'};
        this._detailStyle = {font: '400 14px "Fira Sans", sans-serif', fill: '#FFFFFF'};

        return this;
    };

    Issue.prototype = new Circle();
    Issue.prototype.constructor = Issue;

    Issue.MODE_EXPLORE = 'explore';
    Issue.MODE_TAG = 'tag';
    Issue.MODE_TAG_TITLE = 'tagTitle';
    Issue.MODE_TOPICS = 'topics';
    Issue.MODE_ISSUES = 'issues';
    Issue.MODE_TAG_ISSUES = 'tagIssues';
    Issue.MODE_DETAIL = 'detail';
    Issue.MODE_INTRO = 'intro';
    Issue.MODES = [
        Issue.MODE_EXPLORE,
        Issue.MODE_TOPICS,
        Issue.MODE_ISSUES,
        Issue.MODE_TAG_ISSUES,
        Issue.MODE_DETAIL
    ];

    Issue.prototype.setData = function (data) {
        this.mode = Issue.MODE_EXPLORE;
        Circle.prototype.setData.call(this, data);

        var colors = [0x6bb94e, 0xf6c925, 0xdb3f33];
        this.color = colors[this.data._status];

        this._textAlwaysVisible = false;
    };

    /**
     * Draws an issue circle
     * @param  {number} radius desired radius
     * @param  {number} x x position
     * @param  {number} y y position
     */
    Issue.prototype.draw = function (radius, x, y) {
        x = Math.round(x);
        y = Math.round(y);

        Circle.prototype.draw.call(this, radius, x, y);
        this.elm.interactive = true;
        this.elm.buttonMode = true;
        this.isInteractive = true;
        this.elm.index = this._index;

        var biggestSize = Math.max(this._canvasSize.x, this._canvasSize.y);
        this._openCircle = new PIXI.Graphics();
        this._openCircle.beginFill(this.color);
        this._openCircle.drawCircle(0, 0, biggestSize);
        this._openCircle.scale = {x: 0, y: 0};
        this._openCircle.endFill();
        this.elm.addChild(this._openCircle);

        this.elm.mouseover = this._onMouseOver.bind(this);
        this.elm.mouseout = this._onMouseOut.bind(this);
        this.elm.mousedown = this._onPress.bind(this);
        this.elm.tap = this._onTap.bind(this);
    };

    Issue.prototype._onMouseOver = function () {
        if (this.mouseEnabled) {
            this.mouseOverS.dispatch(this);
        }
    };

    Issue.prototype._onMouseOut = function () {
        if (this.mouseEnabled) {
            this.mouseOutS.dispatch(this);
        }
    };

    Issue.prototype._onPress = function () {
        if (this.mouseEnabled) {
            this.pressS.dispatch(this);
        }
    };

    Issue.prototype._onTap = function () {
        if (this.mouseEnabled) {
            this.tapS.dispatch(this);
        }
    };

    Issue.prototype.setMode = function (mode) {
        var lastMode = this.mode;
        this.mode = mode;

        switch (mode) {
            case Issue.MODE_EXPLORE: {
                this.setTextAlwaysVisible(false);
                this.setIsInteractive(true);
                this.setRadiusChange(true);
                this._title.setStyle(this._titleStyle);
                this._title.hitArea = new PIXI.Rectangle(
                    0,
                    0,
                    this._title.width / Responsive.RATIO,
                    this._title.height / Responsive.RATIO
                );
                this._title.y = Math.round(-(this._title.height / Responsive.RATIO) / 2);
                this._drawCircle(0x222222);
            } break;
            case Issue.MODE_TAG: {
                this.setTextAlwaysVisible(false);
                this.setIsInteractive(false);
                this.setRadiusChange(false);
                this.radius = this.initRadius;
                this._title.alpha = 0;
                this._title.setStyle(this._tagStyle);
                this._title.hitArea = new PIXI.Rectangle(
                    0,
                    0,
                    this._title.width / Responsive.RATIO,
                    this._title.height / Responsive.RATIO
                );
                this._title.x = this.leftSided ? -(this._title.width / Responsive.RATIO) - 10 : 10;
                this._title.y = Math.round(-(this._title.height / Responsive.RATIO) / 2);
                this._drawCircle(0x222222);
            } break;
            case Issue.MODE_TAG_TITLE: {
                this.setTextAlwaysVisible(true);
                this.setIsInteractive(false);
                this.setRadiusChange(false);
                this.radius = this.initRadius;
                this.elm.addChild(this._tagTitle);
                var tagTitleText = this.data.getRelated().length;
                tagTitleText += ' issues related to';
                this._tagTitle.setText(tagTitleText.toUpperCase());
                this._title.setStyle(this._tagTitleStyle);
                this._title.hitArea = new PIXI.Rectangle(
                    0,
                    0,
                    this._title.width / Responsive.RATIO,
                    this._title.height / Responsive.RATIO
                );
                this._title.x = 10;
                this._title.y = Math.round(-(this._title.height / Responsive.RATIO) / 2);
                this._drawCircle(0xFFFFFF);
                this.elm.alpha = 1;
            } break;
            case Issue.MODE_TOPICS: {
                this.stopMoving();
                this.setTextAlwaysVisible(false);
                this.setIsInteractive(false);
                this.setRadiusChange(false);
                this.radius = this.initRadius;
                this._title.setStyle(this._topicStyle);
                this._title.hitArea = new PIXI.Rectangle(
                    0,
                    0,
                    this._title.width / Responsive.RATIO,
                    this._title.height / Responsive.RATIO
                );
                this._title.y = Math.round(-(this._title.height / Responsive.RATIO) / 2);
                this._drawCircle(0x222222);
            } break;
            case Issue.MODE_ISSUES: {
                this.stopMoving();
                this.stopPulsing();
                this.setTextAlwaysVisible(true);
                this.setIsInteractive(false);
                this.setRadiusChange(false);
                this.radius = this.initRadius;
                this._title.setStyle(this._issuesStyle);
                this._title.hitArea = new PIXI.Rectangle(
                    0,
                    0,
                    this._title.width / Responsive.RATIO,
                    this._title.height / Responsive.RATIO
                );
                this._title.y = Math.round(-(this._title.height / Responsive.RATIO) / 2);
                this._drawCircle(0x222222);
                this.elm.alpha = 1;
            } break;
            case Issue.MODE_TAG_ISSUES: {
                this.stopMoving();
                this.stopPulsing();
                this.setTextAlwaysVisible(true);
                this.setIsInteractive(false);
                this.setRadiusChange(false);
                this.radius = this.initRadius;
                this._title.setStyle(this._tagIssuesStyle);
                this._title.hitArea = new PIXI.Rectangle(
                    0,
                    0,
                    this._title.width / Responsive.RATIO,
                    this._title.height / Responsive.RATIO
                );
                this._title.y = Math.round(-(this._title.height / Responsive.RATIO) / 2);
                this._drawCircle(0xffffff);
                this.elm.alpha = 1;
            } break;
            case Issue.MODE_DETAIL: {
                this.stopMoving();
                this.stopPulsing();
                this.setIsInteractive(false);
                this.setTextAlwaysVisible(true);
                this.setRadiusChange(false);
                this.radius = this.initRadius;
                this._title.setStyle(this._detailStyle);
                this._title.hitArea = new PIXI.Rectangle(
                    0,
                    0,
                    this._title.width / Responsive.RATIO,
                    this._title.height / Responsive.RATIO
                );
                this._title.y = Math.round(-(this._title.height / Responsive.RATIO) / 2);
                this._drawCircle(0xffffff);
            } break;
        }

        if (lastMode === Issue.MODE_ISSUES) {
            this.elm.hitArea = null;
            this.elm.alpha = 1;
        }

        if (lastMode === Issue.MODE_TAG_TITLE) {
            this.elm.removeChild(this._tagTitle);
        }
    };

    Issue.prototype.setTextAlwaysVisible = function (isVisible) {
        this._textAlwaysVisible = isVisible;

        if (isVisible) {
            this.elm.addChild(this._title);
            gs.TweenMax.to(this._title, 0.2, {alpha: 1, overwrite: true});
        } else if(!this.isOver) {
            var onOut = function () {
                if (this._title.parent) {
                    this.elm.removeChild(this._title);
                }
            }.bind(this);
            gs.TweenMax.to(this._title, 0.2, {alpha: 0, overwrite: true, onComplete: onOut});
        }
    };

    Issue.prototype.setIsInteractive = function (value) {
        this.isInteractive = value;
    };

    Issue.prototype.setLeftSidedText = function () {
        this.leftSided = true;
        this._title.x = -(this._title.width * Responsive.RATIO) - 10;
    };

    Issue.prototype.setRadiusChange = function (value) {
        this.radiusChange = value;
    };

    /**
     * Sets circle radius based on position
     * Min radius: 2, Max Radius: 10
     */
    Issue.prototype.setRadius = function () {
        if (this.radiusChange) {
            var biggestSize = Math.max(this._canvasSize.x, this._canvasSize.y);
            var d = Math.sqrt(Math.pow(this.elm.x,2) + Math.pow(this.elm.y,2));
            var r = 2 + (8 - 2) * (d - biggestSize / 2) / (0 - biggestSize / 2);
            this.radius = Math.max(r, 2);
            this._drawCircle(this._color);
        }
    };

    /**
     * Sets mouse over
     */
    Issue.prototype.mouseOver = function (mousePosition) {
        Circle.prototype.mouseOver.call(this);

        if (mousePosition) {
            this.mouseOverPosition = mousePosition.clone();
            this.mouseOverPosition.x -= this.elm.x;
            this.mouseOverPosition.y -= this.elm.y;
        }

        this.stopMoving();
        this.lightUp();

        var totalHeight = Math.round(this._title.height / Responsive.RATIO);

        if (this.mode === Issue.MODE_EXPLORE && this._subtitle) {
            totalHeight += Math.round(this._subtitle.height / Responsive.RATIO) + 2;
            this._title.setStyle(this._titleOverStyle);
            this._title.hitArea = new PIXI.Rectangle(
                0,
                0,
                this._title.width / Responsive.RATIO,
                this._title.height / Responsive.RATIO
            );
        }

        this._title.y = Math.round(-totalHeight / 2);

        if (this.mode === Issue.MODE_EXPLORE && this._subtitle) {
            this.elm.addChild(this._subtitle);
            this._subtitle.y = Math.round(this._title.y + (this._title.height / Responsive.RATIO) + 2);
            gs.TweenMax.to(this._subtitle, 0.2, {alpha: 0.5, overwrite: true});
        }

        this.elm.parent.setChildIndex(this.elm, 0);
    };

    /**
     * Sets mouse out
     */
    Issue.prototype.mouseOut = function () {
        Circle.prototype.mouseOut.call(this);
        this.mouseOverPosition = null;

        if (this.isInteractive) {
            var onComplete = null;
            if (this.mode === Issue.MODE_EXPLORE) {
                onComplete = this._resumeStaticAnimation.bind(this);
            }

            gs.TweenMax.to(
                this.elm, 1,
                {
                    x: this._x0, y: this._y0, ease: gs.Elastic.easeOut.config(2, 0.7),
                    overwrite: true, onComplete: onComplete, roundProps: 'x,y'
                }
            );
        }

        if (this.mode === Issue.MODE_EXPLORE) {
            this._title.setStyle(this._titleStyle);
            this._title.hitArea = new PIXI.Rectangle(
                0,
                0,
                this._title.width / Responsive.RATIO,
                this._title.height / Responsive.RATIO
            );
            this._title.y = Math.round(-(this._title.height / Responsive.RATIO) / 2);

            var onHide = function () {
                if (this._subtitle.parent) {
                    this.elm.removeChild(this._subtitle);
                }
            }.bind(this);
            gs.TweenMax.to(this._subtitle, 0.2, {alpha: 0, overwrite: true, onComplete: onHide});
        }

        this.lightDown();

        if (this.mode === Issue.MODE_TAG_ISSUES) {
            this._drawCircle(0xffffff);
        }
    };

    Issue.prototype.openIssue = function () {
        this.elm.removeChild(this._subtitle);

        gs.TweenMax.to(this._openCircle.scale, 0.3, {x: 1, y: 1, overwrite: true});
    };

    Issue.prototype.closeIssue = function () {
        this._openCircle.scale = {x: 0, y: 0};
        this.setMode(Issue.MODE_DETAIL);
    };

    /**
     * animation tick
     * @param  {Point} mousePosition current mouse position
     */
    Issue.prototype.update = function (mousePosition) {
        this.mousePosition = mousePosition;

        if (this.isOver && this.isInteractive) {

            if (!this.mouseOverPosition) {
                this.mouseOverPosition = new PIXI.Point();
            }

            this.elm.x = Math.round(this.mousePosition.x - this.mouseOverPosition.x);
            this.elm.y = Math.round(this.mousePosition.y - this.mouseOverPosition.y);

            var stickyRadius = 15;
            if (Responsive.IS_TOUCH) {
                stickyRadius = 0;
            }

            var maxX = stickyRadius + this.elm.width / 2;
            var maxY = stickyRadius + this.elm.height / 2;

            if (Math.abs(this.elm.x - this._x0) > maxX ||
                    Math.abs(this.elm.y - this._y0) > maxY) {
                this._onMouseOut();
            }
        }
    };

    return Issue;
});
