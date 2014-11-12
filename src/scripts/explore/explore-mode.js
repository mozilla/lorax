/* global define:true */
define(['explore/mode', 'explore/issue'], function (Mode, Issue) {
    'use strict';

    var ExploreMode = function (canvas) {
        this._canvas = canvas;

        return this;
    };

    ExploreMode.prototype = new Mode();
    ExploreMode.prototype.constructor = ExploreMode;

    ExploreMode.prototype.init = function () {
        // set explore radius based on smallest canvas dimension
        var dimension = Math.min(this._canvas.canvasSize.x, this._canvas.canvasSize.y);
        this._exploreRadius = dimension / 2;

        var seed;
        var rSeed;
        var elm;

        // set issue positions
        for (var i = 0; i < this._canvas.issues.length; i ++) {
            seed = Math.random() * Math.PI * 2;
            rSeed = Math.pow(Math.random(), 1/2) * (this._exploreRadius - 20);

            elm = this._canvas.issues[i];
            elm.exploreX = Math.sin(seed) * rSeed;
            elm.exploreY = Math.cos(seed) * rSeed;
            elm.moveTo(elm.exploreX, elm.exploreY);
        };

        // set tags positions
        for (var i = 0; i < this._canvas.tags.length; i ++) {
            seed = Math.random() * Math.PI * 2;
            rSeed = this._exploreRadius + (Math.random() * 5);

            elm = this._canvas.tags[i];
            elm.moveTo(Math.sin(seed) * rSeed, Math.cos(seed) * rSeed);
        };

        // set fakes positions
        for (var i = 0; i < this._canvas.fakes.length; i ++) {
            seed = Math.random() * Math.PI * 2;
            rSeed = Math.pow(Math.random(), 1/3) * (this._exploreRadius - 20);

            elm = this._canvas.fakes[i];
            elm.elm.alpha = 0.1 + (0.3 * rSeed / this._exploreRadius);
            elm.moveTo(Math.sin(seed) * rSeed, Math.cos(seed) * rSeed);
        };
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
                relatedItem = this._canvas.getElementById(related[j]._id);
                isOver = (issue.isOver || relatedItem.isOver);

                this._canvas.drawLine(issue, relatedItem, 0x0, isOver ? 0.15 : 0.03);
            }

            // draw lines connecting related tags
            for (j = 0; j < tags.length; j ++) {
                relatedItem = this._canvas.getElementById(tags[j]._id);
                isOver = (issue.isOver || relatedItem.isOver);

                this._canvas.drawLine(issue, relatedItem, 0x0, isOver ? 0.15 : 0.03);
            }
        }
    };

    ExploreMode.prototype._mouseOverIssue = function (issue) {
        var related = issue.data.getRelated();
        var relatedIssue;
        var i;

        issue.mouseOver();
        for(i = 0; i < related.length; i ++) {
            relatedIssue = this._canvas.getElementById(related[i]._id);
            relatedIssue.lightUp()
        }
    };

    ExploreMode.prototype._mouseOutIssue = function (issue) {
        var related = issue.data.getRelated();
        var relatedIssue;
        var i;

        issue.mouseOut();
        for(i = 0; i < related.length; i ++) {
            relatedIssue = this._canvas.getElementById(related[i]._id);
            relatedIssue.lightDown();
        }
    };

    ExploreMode.prototype._updateIssues = function () {
        var i;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            this._canvas.issues[i].update(this._canvas.mousePosition);
        }

        for (i = 0; i < this._canvas.tags.length; i ++) {
            this._canvas.tags[i].update(this._canvas.mousePosition);
        }
    };

    ExploreMode.prototype._onStartShow = function () {
        // set position for issues
        var issue;
        var i;

        for (var i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.setMode(Issue.MODE_EXPLORE);
            issue.moveTo(issue.exploreX, issue.exploreY)
                .call(issue._resumeStaticAnimation.bind(issue));
            issue.exploreMouseOver = this._mouseOverIssue.bind(this);
            issue.exploreMouseOut = this._mouseOutIssue.bind(this);
            issue.mouseOverS.add(issue.exploreMouseOver);
            issue.mouseOutS.add(issue.exploreMouseOut);
        };

        for (i = 0; i < this._canvas.tags.length; i ++) {
            this._canvas.tags[i].implode();
        }

        for (i = 0; i < this._canvas.fakes.length; i ++) {
            this._canvas.fakes[i].implode();
        }

        this._updateIssuesBind = this._updateIssues.bind(this);
        this._drawLinesBind = this._drawLines.bind(this);
        this._canvas.renderStartS.add(this._updateIssuesBind);
        this._canvas.renderStartS.add(this._drawLinesBind);
        this._canvas.showLines();

        setTimeout(this._onShow.bind(this), 500);
    };

    ExploreMode.prototype._onStartHide = function () {
        var issue;
        var i;

        for (i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            issue.mouseOverS.remove(issue.exploreMouseOver);
            issue.mouseOutS.remove(issue.exploreMouseOut);
        }

        for (i = 0; i < this._canvas.tags.length; i ++) {
            this._canvas.tags[i].explode(this._exploreRadius);
        }

        for (i = 0; i < this._canvas.fakes.length; i ++) {
            this._canvas.fakes[i].explode(this._exploreRadius);
        }

        this._canvas.renderStartS.remove(this._updateIssuesBind);
        this._canvas.renderStartS.remove(this._drawLinesBind);
        this._canvas.hideLines();

        setTimeout(this._onHide.bind(this), 0);
    };

    return ExploreMode;
});