/* global define:true */
define(['pixi', 'experience/mode', 'experience/issue'], function (PIXI, Mode, Issue) {
    'use strict';

    var ExploreMode = function (canvas) {
        this._canvas = canvas;
        Mode.MODES.push(this);
        Mode.DEFAULT_MODE = this;

        ExploreMode.AUTO_MODE_TIME = 5000;
        ExploreMode.AUTO_MODE_TIMEOUT = 4000;

        this._safeZone = {x: 0, y: 0, width: 0, height: 0};

        return this;
    };

    ExploreMode.prototype = new Mode();
    ExploreMode.prototype.constructor = ExploreMode;

    ExploreMode.prototype.init = function () {
        Mode.prototype.init.call(this);
        // set explore radius based on smallest canvas dimension
        var dimension = Math.min(this._canvas.canvasSize.x, this._canvas.canvasSize.y);
        this._exploreRadius = dimension / 1.7;

        var seed;
        var rSeed;
        var elm;
        var i;
        var j;
        var isInsideBounds;
        var isOnSafeZone;
        var tries;
        var lines = [];
        var line;
        var isLineFree;

        var issueWidth = 100;
        var issueHeight = 10;
        var displaceY = 0;
        var maxTries = 2048;

        // set issue positions
        for (i = 0; i < this._canvas.issues.length; i ++) {
            elm = this._canvas.issues[i];
            tries = 0;
            isLineFree = true;

            do {
                // make it evenly distributed
                seed = (i / this._canvas.issues.length) * Math.PI * 2;
                rSeed = Math.pow(Math.random(), 1/2) * (this._exploreRadius - 20);
                elm.exploreX = Math.sin(seed) * rSeed;
                elm.exploreY = Math.cos(seed) * rSeed;

                line = Math.floor(elm.exploreY / issueHeight);
                elm.exploreY = (line * issueHeight) + displaceY;

                // makes sure issues don't overlap
                if (!lines[line]) {
                    lines[line] = [];
                } else {
                    for (j = 0; j < lines[line].length; j ++) {
                        isLineFree = isLineFree && Math.abs(lines[line][j].exploreX - elm.exploreX) > issueWidth;
                    }
                }

                isInsideBounds = (
                    elm.exploreX > -this._canvas.canvasSize.x / 2 &&
                    elm.exploreX < this._canvas.canvasSize.x / 2 &&
                    elm.exploreY > -this._canvas.canvasSize.y / 2 &&
                    elm.exploreY < this._canvas.canvasSize.y / 2
                );

                isOnSafeZone = (
                    elm.exploreX > this._safeZone.x &&
                    elm.exploreX < this._safeZone.x + this._safeZone.width &&
                    elm.exploreY > this._safeZone.y &&
                    elm.exploreY < this._safeZone.y + this._safeZone.height
                );

                if (tries === Math.round(maxTries / 2)) {
                    displaceY = issueHeight / 2;
                }
                if (tries === maxTries - 1) {
                    console.log(elm.data.getId(), elm.exploreX, elm.exploreY);
                }
            } while ((!isInsideBounds || isOnSafeZone || !isLineFree) && tries ++ < maxTries);

            lines[line].push(elm);
            elm.moveTo(0, 0);
        }

        // set tags positions
        for (i = 0; i < this._canvas.tags.length; i ++) {
            elm = this._canvas.tags[i];

            do {
                seed = Math.random() * Math.PI * 2;
                rSeed = this._exploreRadius + (Math.random() * 5);
                elm.exploreX = Math.sin(seed) * rSeed;
                elm.exploreY = Math.cos(seed) * rSeed;

                isInsideBounds = (
                    elm.exploreX > -this._canvas.canvasSize.x / 2 &&
                    elm.exploreX < this._canvas.canvasSize.x / 2 &&
                    elm.exploreY > -this._canvas.canvasSize.y / 2 &&
                    elm.exploreY < this._canvas.canvasSize.y / 2
                );
            } while (!isInsideBounds);

            if (elm.exploreX < 0) {
                elm.setLeftSidedText();
            }
        }

        // set fakes positions
        for (i = 0; i < this._canvas.fakes.length; i ++) {
            seed = Math.random() * Math.PI * 2;
            rSeed = Math.pow(Math.random(), 1/3) * (this._exploreRadius - 20);

            elm = this._canvas.fakes[i];
            elm.elm.alpha = 0.1 + (0.3 * rSeed / this._exploreRadius);
            elm.exploreX = Math.sin(seed) * rSeed;
            elm.exploreY = Math.cos(seed) * rSeed;
        }
    };

    ExploreMode.prototype.setSafeZone = function (safeZone) {
        this._safeZone = safeZone;
    };

    ExploreMode.prototype._startAutoMode = function () {
        this._autoMode = true;

        this._autoModeIssue = this._canvas.issues[Math.floor(Math.random() * this._canvas.issues.length)];
        this._canvas.mousePosition = this._canvas.autoModePosition = new PIXI.Point(
            this._autoModeIssue.elm.x,
            this._autoModeIssue.elm.y
        );
        this._mouseOverIssue(this._autoModeIssue);

        clearTimeout(this._autoModeTimeout);
        this._autoModeTimeout = setTimeout(
            this._endAutoMode.bind(this),
            ExploreMode.AUTO_MODE_TIMEOUT,
            true
        );
    };

    ExploreMode.prototype._endAutoMode = function (startAnother) {
        if (this._autoModeIssue) {
            this._mouseOutIssue(this._autoModeIssue);
        }

        this._autoMode = false;
        this._canvas.autoModePosition = null;

        if (this._autoModeTimeout) {
            clearTimeout(this._autoModeTimeout);
        }
        if (startAnother) {
            this._autoModeTimeout = setTimeout(
                this._startAutoMode.bind(this),
                ExploreMode.AUTO_MODE_TIME
            );
        }
    };

    ExploreMode.prototype._drawLines = function () {
        var i;
        var j;
        var issue;
        var related;
        var relatedItem;
        var tags;
        var isOver;

        this._canvas.clearLines();

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            related = issue.data.getRelated();
            tags = issue.data.getTags();

            // draw lines connecting related issues
            for (j = 0; j < related.length; j ++) {
                relatedItem = this._canvas.getElementByData(related[j]);
                isOver = (issue.isOver || relatedItem.isOver);

                this._canvas.drawLine(issue, relatedItem, 0x0, isOver ? 0.05 : 0.02);
            }

            // draw lines connecting related tags
            for (j = 0; j < tags.length; j ++) {
                relatedItem = this._canvas.getElementByData(tags[j]);
                isOver = (issue.isOver || relatedItem.isOver);

                this._canvas.drawLine(issue, relatedItem, 0x0, isOver ? 0.05 : 0.02);
            }
        }
    };

    ExploreMode.prototype._mouseOverIssue = function (issue) {
        this.selectedIssue = issue;

        var related = issue.data.getRelated();
        var tags;
        var relatedIssue;
        var i;

        if (issue.data.getTags) {
            tags =  issue.data.getTags();
        }

        if (this._autoModeIssue && issue !== this._autoModeIssue) {
            this._endAutoMode();
        }

        issue.mouseOver(this._canvas.mousePosition);

        for(i = 0; i < related.length; i ++) {
            relatedIssue = this._canvas.getElementByData(related[i]);
            relatedIssue.lightUp();
            relatedIssue.stopMoving();
        }

        if (tags) {
            for(i = 0; i < tags.length; i ++) {
                relatedIssue = this._canvas.getElementByData(tags[i]);
                relatedIssue.lightUp();
                relatedIssue.stopMoving();
            }
        }
    };

    ExploreMode.prototype._mouseOutIssue = function (issue) {
        if (!this._tapped) {
            this.selectedIssue = null;
        }
        this._tapped = null;

        var related = issue.data.getRelated();
        var tags;
        var relatedIssue;
        var i;

        if (issue.data.getTags) {
            tags =  issue.data.getTags();
        }

        if (this._autoModeIssue && issue !== this._autoModeIssue) {
            this._endAutoMode(true);
        }

        issue.mouseOut();

        for(i = 0; i < related.length; i ++) {
            if (related[i] === issue.data) {
                continue;
            }
            relatedIssue = this._canvas.getElementByData(related[i]);
            relatedIssue.lightDown();
            relatedIssue._resumeStaticAnimation();
        }

        if (tags) {
            for(i = 0; i < tags.length; i ++) {
                relatedIssue = this._canvas.getElementByData(tags[i]);
                relatedIssue.lightDown();
                relatedIssue._resumeStaticAnimation();
            }
        }
    };

    ExploreMode.prototype._tapIssue = function (issue) {
        this._tapped = true;
        if (!this.selectedIssue) {
            issue._onMouseOver();
        } else if (this.selectedIssue === issue) {
            issue._onPress();
        } else {
            this.selectedIssue._onMouseOut();
            issue._onMouseOver();
        }
    };

    ExploreMode.prototype._onStartShow = function () {
        // set position for issues
        var issue;
        var i;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.setMode(Issue.MODE_EXPLORE);
            issue.moveTo(
                issue.exploreX,
                issue.exploreY,
                issue._resumeStaticAnimation.bind(issue),
                {alpha: 1});
            issue.exploreMouseOver = this._mouseOverIssue.bind(this);
            issue.exploreMouseOut = this._mouseOutIssue.bind(this);
            issue.exploreTap = this._tapIssue.bind(this);
            issue.mouseOverS.add(issue.exploreMouseOver);
            issue.mouseOutS.add(issue.exploreMouseOut);
            issue.tapS.add(issue.exploreTap);
        }

        for (i = 0; i < this._canvas.tags.length; i ++) {
            issue = this._canvas.tags[i];
            issue.setMode(Issue.MODE_TAG);
            issue._x0 = issue.exploreX;
            issue._y0 = issue.exploreY;
            issue.implode();
            issue.exploreMouseOver = this._mouseOverIssue.bind(this);
            issue.exploreMouseOut = this._mouseOutIssue.bind(this);
            issue.exploreTap = this._tapIssue.bind(this);
            issue.mouseOverS.add(issue.exploreMouseOver);
            issue.mouseOutS.add(issue.exploreMouseOut);
            issue.tapS.add(issue.exploreTap);
        }

        for (i = 0; i < this._canvas.fakes.length; i ++) {
            issue = this._canvas.fakes[i];
            issue._x0 = issue.exploreX;
            issue._y0 = issue.exploreY;
            issue.implode();
        }

        this._drawLinesBind = this._drawLines.bind(this);
        this._canvas.renderStartS.add(this._drawLinesBind);

        // start a new autoMode timeout
        this._endAutoMode(true);
        setTimeout(this._onShow.bind(this), 500);
    };

    ExploreMode.prototype._onStartHide = function () {
        var issue;
        var i;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.explode(this._exploreRadius);
            issue.mouseOverS.remove(issue.exploreMouseOver);
            issue.mouseOutS.remove(issue.exploreMouseOut);
            issue.tapS.remove(issue.exploreTap);
        }

        for (i = 0; i < this._canvas.tags.length; i ++) {
            issue = this._canvas.tags[i];
            issue.explode(this._exploreRadius);
            issue.mouseOverS.remove(issue.exploreMouseOver);
            issue.mouseOutS.remove(issue.exploreMouseOut);
            issue.tapS.remove(issue.exploreTap);
        }

        for (i = 0; i < this._canvas.fakes.length; i ++) {
            this._canvas.fakes[i].explode(this._exploreRadius);
        }

        this._canvas.clearLines();
        this._canvas.renderStartS.remove(this._drawLinesBind);

        this._endAutoMode();

        setTimeout(this._onHide.bind(this), 100);
    };

    return ExploreMode;
});