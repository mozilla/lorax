/* global define:true */
define([
    'pixi',
    'explore/mode',
    'explore/issue',
    'explore/responsive',
    'jquery',
    'jquery-mousewheel'
], function (
    PIXI,
    Mode,
    Issue,
    Responsive,
    $
) {
    'use strict';

    var IssuesMode = function (canvas) {
        this._canvas = canvas;

        return this;
    };

    IssuesMode.prototype = new Mode();
    IssuesMode.prototype.constructor = IssuesMode;

    IssuesMode.prototype.init = function () {
        this._scrollPosition = this._scrollFinalPosition = 0;
        this._touchPosition =  this._touchDelta = this._touchFinalDelta = 0;

        this._issueMargin = 80;

        var topMargin = 200;
        var leftMargin = 400;
        if (Responsive.IS_SMALL()) {
            topMargin = 250;
            leftMargin = 100;
        }

        this._scrollArea = new PIXI.Rectangle(
            -((this._canvas.canvasSize.x - leftMargin) / 2),
            -((this._canvas.canvasSize.y - topMargin) / 2),
            this._canvas.canvasSize.x - leftMargin,
            this._canvas.canvasSize.y - topMargin
        );

        var i;
        var issue;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.issueX = this._scrollArea.x;
            issue.issueY = this._scrollArea.y + (this._issueMargin * i);
        }
    };

    IssuesMode.prototype._drawLines = function () {
        var i;
        var issue;
        var relatedItem;

        this._canvas.clearLines();

        for (i = 0; i < this._canvas.issues.length - 1; i ++) {
            issue = this._canvas.issues[i];
            relatedItem = this._canvas.issues[i + 1];

            this._canvas.drawLine(issue, relatedItem, 0x0, 0.10);
        }
    };

    IssuesMode.prototype._mouseOverIssue = function (issue) {
        issue.mouseOver();
    };

    IssuesMode.prototype._mouseOutIssue = function (issue) {
        issue.mouseOut();
    };

    IssuesMode.prototype._onMouseWheel = function (event) {
        this._scrollTo(event.deltaY / 5);
    };

    IssuesMode.prototype._onTouching = function (event) {
        var newPosition = event.getLocalPosition(this._canvas._stage).y;
        newPosition -= this._canvas.canvasSize.y / 2;

        this._touchDelta = this._touchFinalDelta = newPosition - this._touchPosition;
        this._touchPosition = newPosition;

        this._scrollTo(this._touchDelta);
    };

    IssuesMode.prototype._onTouchStart = function (event) {
        if (this._touchInterval) {
            clearInterval(this._touchInterval);
        }

        this._touchPosition = event.getLocalPosition(this._canvas._stage).y;
        this._touchPosition -= this._canvas.canvasSize.y / 2;
    };

    IssuesMode.prototype._onTouchEnd = function (event) {
        this._touchInterval = setInterval(function () {
            this._touchDelta += (this._touchFinalDelta - this._touchDelta) / 5;
            this._scrollTo(this._touchDelta);

            if (Math.abs(this._touchFinalDelta - this._touchDelta) < 1) {
                clearInterval(this._touchInterval);
            };
        }.bind(this), 1000 / 15);
    };

    IssuesMode.prototype._scrollTo = function (delta) {
        this._scrollFinalPosition += delta;

        this._scrollFinalPosition = Math.max(
            Math.min(this._scrollFinalPosition, 0),
            (this._scrollArea.y - (this._issueMargin * this._canvas.issues.length)
            + this._scrollArea.height * 1.5)
        );

        this._scrollPosition += (this._scrollFinalPosition - this._scrollPosition) / 3;

        var i, issue;
        for (i = 0; i < this._canvas.issues.length; i ++) {
          issue = this._canvas.issues[i];
          issue.elm.y = Math.round(issue.issueY + this._scrollPosition);
        }
    };

    IssuesMode.prototype._onStartShow = function () {
        var i;
        var issue;

        this._scrollPosition = this._scrollFinalPosition = 0;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.setMode(Issue.MODE_ISSUES);
            issue.moveTo(issue.issueX, issue.issueY);
            issue.issueMouseOver = this._mouseOverIssue.bind(this);
            issue.issueMouseOut = this._mouseOutIssue.bind(this);
            issue.mouseOverS.add(issue.issueMouseOver);
            issue.mouseOutS.add(issue.issueMouseOut);
        }

        this._drawLinesBind = this._drawLines.bind(this);
        this._canvas.renderStartS.add(this._drawLinesBind);

        $(document).on('mousewheel', this._onMouseWheel.bind(this));
        this._canvas._stage.touchstart = this._onTouchStart.bind(this);
        this._canvas._stage.touchend = this._onTouchEnd.bind(this);
        this._canvas._stage.touchmove = this._onTouching.bind(this);

        setTimeout(this._onShow.bind(this), 500);
    };

    IssuesMode.prototype._onStartHide = function () {
        var i;
        var issue;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.mouseOverS.remove(issue.issueMouseOver);
            issue.mouseOutS.remove(issue.issueMouseOut);
        }

        this._canvas.renderStartS.remove(this._drawLinesBind);

        setTimeout(this._onHide.bind(this), 0);
    };

    return IssuesMode;
});