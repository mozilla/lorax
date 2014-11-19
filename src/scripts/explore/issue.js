/* global define:true */
define([
    'explore/circle',
    'pixi',
    'createjs',
    'signals'
], function (
    Circle,
    PIXI,
    createjs,
    signals
) {
    'use strict';

    var Issue = function (index, canvasSize) {
        this._index = index;
        this._canvasSize = canvasSize;
        this.elm = new PIXI.DisplayObjectContainer();

        this.mouseOverS = new signals.Signal();
        this.mouseOutS = new signals.Signal();
        this.pressS = new signals.Signal();

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

        this.elm.mouseover = this.elm.touchstart = this._onMouseOver.bind(this);
        this.elm.mouseout = this._onMouseOut.bind(this);
        this.elm.mousedown = this._onPress.bind(this);
    };

    Issue.prototype._onMouseOver = function () {
        this.mouseOverS.dispatch(this);
    };

    Issue.prototype._onMouseOut = function () {
        this.mouseOutS.dispatch(this);
    };

    Issue.prototype._onPress = function () {
        this.pressS.dispatch(this);
    };

    Issue.prototype.setMode = function (mode) {
        var lastMode = this.mode;
        this.mode = mode;

        switch (mode) {
            case Issue.MODE_EXPLORE: {
                this.setTextAlwaysVisible(false);
                this.setIsInteractive(true);
                this._title.setStyle(this._titleStyle);
                this._title.y = Math.round(-this._title.height / 2);
                this._drawCircle(0x222222);
            } break;
            case Issue.MODE_TAG: {
                this.setTextAlwaysVisible(false);
                this.setIsInteractive(false);
                this._title.setStyle(this._tagStyle);
                this._title.x = 10;
                this._title.y = Math.round(-this._title.height / 2);
                this._drawCircle(0x222222);
            } break;
            case Issue.MODE_TAG_TITLE: {
                this.setTextAlwaysVisible(true);
                this.setIsInteractive(false);
                this.elm.addChild(this._tagTitle);
                var tagTitleText = this.data.getRelated().length;
                tagTitleText += ' issues related to';
                this._tagTitle.setText(tagTitleText.toUpperCase());
                this._title.setStyle(this._tagTitleStyle);
                this._title.x = 10;
                this._title.y = Math.round(-this._title.height / 2);
                this._drawCircle(0xFFFFFF);
                this.elm.alpha = 1;
            } break;
            case Issue.MODE_TOPICS: {
                this.setTextAlwaysVisible(false);
                this.setIsInteractive(false);
                this._title.setStyle(this._topicStyle);
                this._title.y = Math.round(-this._title.height / 2);
                this._drawCircle(0x222222);
            } break;
            case Issue.MODE_ISSUES: {
                this.stopMoving();
                this.setTextAlwaysVisible(true);
                this.setIsInteractive(false);
                this._title.setStyle(this._issuesStyle);
                this._title.y = Math.round(-this._title.height / 2);
                if (!this._issueModeArea) {
                    this._issueModeArea = new PIXI.Rectangle(0, -40, this.elm.width, 80);
                }
                this.elm.hitArea = this._issueModeArea;
                this._drawCircle(0x222222);
            } break;
            case Issue.MODE_TAG_ISSUES: {
                this.stopMoving();
                this.setTextAlwaysVisible(true);
                this.setIsInteractive(false);
                this._title.setStyle(this._tagIssuesStyle);
                this._title.y = Math.round(-this._title.height / 2);
                if (!this._issueModeArea) {
                    this._issueModeArea = new PIXI.Rectangle(0, -40, this.elm.width, 80);
                }
                this.elm.hitArea = this._issueModeArea;
                this._drawCircle(0xffffff);
            } break;
            case Issue.MODE_DETAIL: {
                this.stopMoving();
                this.setIsInteractive(false);
                this.setTextAlwaysVisible(true);
                this._title.setStyle(this._detailStyle);
                this._title.y = Math.round(-this._title.height / 2);
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
            createjs.Tween.get(this._title, {override: true})
                .to({alpha: 1}, 200, createjs.Ease.quartIn);
        } else if(!this.isOver) {
            createjs.Tween.get(this._title, {override: true})
                .to({alpha: 0}, 200, createjs.Ease.quartOut)
                .call(function () {
                    if (this._title.parent) {
                        this.elm.removeChild(this._title);
                    }
                }.bind(this));
        }
    };

    Issue.prototype.setIsInteractive = function (value) {
        this.isInteractive = value;
    };

    /**
     * Sets mouse over
     */
    Issue.prototype.mouseOver = function () {
        Circle.prototype.mouseOver.call(this);

        this.stopMoving();
        this.lightUp();

        var totalHeight = this._title.height;

        if (this.mode === Issue.MODE_EXPLORE && this._subtitle) {
            totalHeight += this._subtitle.height + 2;
            this._title.setStyle(this._titleOverStyle);
        }

        this._title.y = Math.round(-totalHeight / 2);

        if (this.mode === Issue.MODE_EXPLORE && this._subtitle) {
            this.elm.addChild(this._subtitle);
            this._subtitle.y = Math.round(this._title.y + this._title.height + 2);
            createjs.Tween.get(this._subtitle, {override: true})
            .to({alpha: 1}, 200, createjs.Ease.quartIn);
        }
    };

    /**
     * Sets mouse out
     */
    Issue.prototype.mouseOut = function () {
        Circle.prototype.mouseOut.call(this);

        if (this.mode === Issue.MODE_EXPLORE) {
            var tweenBack = createjs.Tween.get(this.elm, {override: true})
            .to({x: this._x0, y: this._y0}, 500, createjs.Ease.getBackOut(2.5));

            tweenBack.call(this._resumeStaticAnimation.bind(this));
            this._title.setStyle(this._titleStyle);
            this._title.y = Math.round(-this._title.height / 2);

            createjs.Tween.get(this._subtitle, {override: true})
                .to({alpha: 0}, 200, createjs.Ease.quartOut)
                .call(function () {
                    if (this._subtitle.parent) {
                        this.elm.removeChild(this._subtitle);
                    }
                }.bind(this));
        }

        this.lightDown();

        if (this.mode === Issue.MODE_TAG_ISSUES) {
            this._drawCircle(0xffffff);
        }
    };

    Issue.prototype.openIssue = function () {
        this.elm.removeChild(this._subtitle);

        createjs.Tween.get(this._openCircle.scale, {override: true}).to(
            {x:1, y:1},
            300,
            createjs.Ease.sineOut
        );
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
        if (this.isOver && this.isInteractive) {
            this.elm.x = Math.round(mousePosition.x);
            this.elm.y = Math.round(mousePosition.y);

            var stickyRadius = 30;
            if (Math.abs(this.elm.x - this._x0) > stickyRadius ||
                    Math.abs(this.elm.y - this._y0) > stickyRadius) {
                this.mouseOut();
            }
        }
        // this.elm.aplha = isOver && !circle.isOver ? 0.5 : 1;
    };

    return Issue;
});