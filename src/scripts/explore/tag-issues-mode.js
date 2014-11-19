/* global define:true */
define([
    'pixi',
    'explore/issues-mode',
    'explore/issue'
], function (
    PIXI,
    IssuesMode,
    Issue
) {
    'use strict';

    var TagIssuesMode = function (canvas) {
        this._canvas = canvas;

        return this;
    };

    TagIssuesMode.prototype = new IssuesMode();
    TagIssuesMode.prototype.constructor = TagIssuesMode;

    TagIssuesMode.prototype.init = function () {
        IssuesMode.prototype.init.call(this);

        this._drawCloseButton();

        this._margin.top += this._issueMargin + 100;
        this._updateScroll();

    };

     TagIssuesMode.prototype._drawCloseButton = function () {
        this._closeButton = new PIXI.DisplayObjectContainer();

        var texture = PIXI.Texture.fromImage('/images/icons/png/close.png');
        var img = new PIXI.Sprite(texture);
        img.x = -25;
        img.y = -25;
        this._closeButton.addChild(img);

        this._closeButton.x = (this._canvas.canvasSize.x / 2) - 65;
        this._closeButton.y = -(this._canvas.canvasSize.y / 2) + 65;
        this._closeButton.alpha = 0;
        this._closeButton.elm = this._closeButton; // hack
        this._closeButton.interactive = true;
        this._closeButton.buttonMode = true;
        this._closeButton.mousedown = this._closeButton.tap = this._onPressClose.bind(this);

        this._closeButtonContainer = new PIXI.DisplayObjectContainer();
        this._closeButtonContainer.x = this._canvas.canvasSize.x / 2;
        this._closeButtonContainer.y = this._canvas.canvasSize.y / 2;
        this._closeButtonContainer.addChild(this._closeButton);
        this._canvas.addChild(this._closeButtonContainer);
     };

    TagIssuesMode.prototype.setTag = function (data) {
        this._tag = this._canvas.getElementByData(data);

        this._issues = [];
        var related = data.getRelated();
        for (var i = 0; i < related.length; i ++) {
            this._issues.push(this._canvas.getElementByData(related[i]));
        }

        this._updateScroll();
    };

    TagIssuesMode.prototype._onPressClose = function () {
        this.hide();
    };

    TagIssuesMode.prototype._drawLines = function () {
        var i;
        var issue;
        var relatedItem;

        this._canvas.clearLines();

        this._canvas.drawLine(this._closeButton, this._tag, 0xFFFFFF, 0.10);
        this._canvas.drawLine(this._tag, this._issues[0], 0xFFFFFF, 0.10);

        for (i = 0; i < this._issues.length - 1; i ++) {
            issue = this._issues[i];
            relatedItem = this._issues[i + 1];

            this._canvas.drawLine(issue, relatedItem, 0xFFFFFF, 0.10);
        }
    };

    TagIssuesMode.prototype._scrollTo = function (delta) {
        IssuesMode.prototype._scrollTo.call(this, delta);
        this._tag.elm.y = Math.round(this._tag.issueY + this._scrollPosition);
    };

    TagIssuesMode.prototype._onStartShow = function () {
        var i;
        var issue;

        this._scrollPosition = this._scrollFinalPosition = 0;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.explode();
        }

        for (i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.setMode(Issue.MODE_TAG_ISSUES);
            issue.moveTo(issue.issueX, issue.issueY);
            // so mouse over doesnt block animation
            setTimeout(this._setIssueMouseEvents.bind(this), 500, issue);
        }

        var x0 = this._tag._x0;
        var y0 = this._tag._y0;
        this._tag.setMode(Issue.MODE_TAG_TITLE);
        this._tag.issueX = this._scrollArea.x - 40;
        this._tag.issueY = this._scrollArea.y - this._issueMargin;
        this._tag.moveTo(this._tag.issueX, this._tag.issueY);
        this._tag._x0 = x0;
        this._tag._y0 = y0;

        this._closeButton.alpha = 1;

        this._drawLinesBind = this._drawLines.bind(this);
        this._canvas.renderStartS.add(this._drawLinesBind);

        $(document).on('mousewheel', this._onMouseWheel.bind(this));
        this._canvas._stage.touchstart = this._onTouchStart.bind(this);
        this._canvas._stage.touchend = this._onTouchEnd.bind(this);
        this._canvas._stage.touchmove = this._onTouching.bind(this);

        setTimeout(this._onShow.bind(this), 500);
    };

    TagIssuesMode.prototype._onStartHide = function () {
        var i;
        var issue;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.elm.alpha = 1;
        }

        this._closeButton.alpha = 0;
        this._canvas.renderStartS.remove(this._drawLinesBind);

        setTimeout(this._onHide.bind(this), 100);
    };

    return TagIssuesMode;
});