/* global define:true */
define([
    'pixi',
    'experience/mode',
    'experience/issue',
    'experience/responsive',
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
        Mode.prototype.init.call(this);
        this._scrollPosition = this._scrollFinalPosition = 0;
        this._touchPosition =  this._touchDelta = this._touchFinalDelta = 0;

        this._issueMargin = 80;

        this._issues = this._canvas.issues;

        this._margin = {
            top: 200,
            left: 400
        };

        if (Responsive.IS_SMALL()) {
            this._margin.top = 250;
            this._margin.left = 100;
        }

        this._updateScroll();
    };

    IssuesMode.prototype._updateScroll = function () {
        this._scrollArea = new PIXI.Rectangle(
            -((this._canvas.canvasSize.x - this._margin.left) / 2),
            -((this._canvas.canvasSize.y - this._margin.top) / 2),
            this._canvas.canvasSize.x - this._margin.left,
            this._canvas.canvasSize.y - this._margin.top
        );

        var i;
        var issue;

        for (i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.issueX = this._scrollArea.x;
            issue.issueY = this._scrollArea.y + (this._issueMargin * i);
        }
    };

    IssuesMode.prototype._drawLines = function () {
        var i;
        var issue;
        var relatedItem;

        this._canvas.clearLines();

        for (i = 0; i < this._issues.length - 1; i ++) {
            issue = this._issues[i];
            relatedItem = this._issues[i + 1];

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

    IssuesMode.prototype._onTouchEnd = function () {
        this._touchInterval = setInterval(function () {
            this._touchDelta += (this._touchFinalDelta - this._touchDelta) / 5;
            this._scrollTo(this._touchDelta);

            if (Math.abs(this._touchFinalDelta - this._touchDelta) < 1) {
                clearInterval(this._touchInterval);
            }
        }.bind(this), 1000 / 15);
    };

    IssuesMode.prototype._scrollTo = function (delta) {
        this._scrollFinalPosition += delta;

        this._scrollFinalPosition = Math.max(
            Math.min(this._scrollFinalPosition, 0),
            (this._scrollArea.y - (this._issueMargin * this._canvas.issues.length) +
            this._scrollArea.height * 1.5)
        );

        this._scrollPosition += (this._scrollFinalPosition - this._scrollPosition) / 3;

        var i, issue;
        for (i = 0; i < this._canvas.issues.length; i ++) {
          issue = this._canvas.issues[i];
          issue.elm.y = Math.round(issue.issueY + this._scrollPosition);
        }
    };

    IssuesMode.prototype._setIssueMouseEvents = function (issue) {
        issue.issueMouseOver = this._mouseOverIssue.bind(this);
        issue.issueMouseOut = this._mouseOutIssue.bind(this);
        issue.mouseOverS.add(issue.issueMouseOver);
        issue.mouseOutS.add(issue.issueMouseOut);
    };

    IssuesMode.prototype._onStartShow = function () {
        var i;
        var issue;

        this._scrollPosition = this._scrollFinalPosition = 0;
        this._updateScroll();

        for (i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.setMode(Issue.MODE_ISSUES);
            issue.elm.alpha = 1;
            issue.moveTo(issue.issueX, issue.issueY);
            // so mouse over doesnt block animation
            setTimeout(this._setIssueMouseEvents.bind(this), 500, issue);
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

        for (i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.mouseOverS.remove(issue.issueMouseOver);
            issue.mouseOutS.remove(issue.issueMouseOut);
        }

        this._canvas.clearLines();
        this._canvas.renderStartS.remove(this._drawLinesBind);

        setTimeout(this._onHide.bind(this), 100);
    };

    return IssuesMode;
});