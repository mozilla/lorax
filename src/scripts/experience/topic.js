/* global define:true */
define([
    'pixi',
    'gs',
    'signals',
    'experience/issue',
    'experience/responsive'
], function (
    PIXI,
    gs,
    signals,
    Issue,
    Responsive
) {
    'use strict';

    var Topic = function (data, index, issues, fakes) {
        this._radius = 70;
        this._linearDist = 40;
        this._linearWidth = 100;
        this.isOver = false;

        this._data = data;
        this._index = index;
        this._issues = issues;
        this._fakes = fakes;

        this.elm = new PIXI.DisplayObjectContainer();

        this.mouseOverS = new signals.Signal();
        this.mouseOutS = new signals.Signal();

        // this._topicArea;
        // this._linearArea;
        // this._topicTitle;
        // this._topicDesc;

        Topic.TOPICS.push(this);
    };

    Topic.TOPICS = [];
    Topic.SELECTED_TOPIC = null;

    Topic.prototype.setup = function () {
        // topic mouse over
        this._topicArea = new PIXI.Graphics();
        this._topicArea.i = this._index;
        this._topicArea.hitArea = new PIXI.Rectangle(
            -this._radius,
            -this._radius,
            this._radius * 2,
            this._radius * 2);
        this._topicArea.interactive = true;
        this._topicArea.buttonMode = true;
        this.elm.addChild(this._topicArea);
        this._topicArea.mouseover = this._mouseOver.bind(this);
        this._topicArea.tap = this._mouseOver.bind(this);

        // topic mouse out area
        var aMargin = 20;
        this._linearArea = new PIXI.Graphics();
        this._linearArea.i = this._index;
        this._linearArea.x = - 100 - aMargin / 2;
        this._linearArea.interactive = true;
        this._linearArea.buttonMode = true;
        this._linearArea.hitArea = new PIXI.Rectangle(
            -this._linearWidth / 2,
            -(this._linearDist * this._issues.length / 2) - aMargin,
            this._linearWidth + 100 + aMargin,
            (this._linearDist * this._issues.length) + aMargin);

        // title
        this._topicTitle = new PIXI.Text(this._data.getName().toUpperCase(),
            {font: '300 22px "Fira Sans", sans-serif', fill: '#222222'});
        this.elm.addChild(this._topicTitle);
        this._topicTitle.resolution = Responsive.RATIO;
        this._topicTitle.x = Math.round(-(this._topicTitle.width / Responsive.RATIO) / 2);
        this._topicTitle.y = Math.round(-(this._topicTitle.height / Responsive.RATIO) / 2);

        // description
        this._topicDesc = new PIXI.Text(this._data.getTagline(),
            {
                font: '300 14px "Fira Sans", sans-serif',
                fill: '#666666',
                wordWrap: true,
                wordWrapWidth: 200,
                align: 'center'
        });
        this.elm.addChild(this._topicDesc);
        this._topicDesc.resolution = Responsive.RATIO;
        this._topicDesc.x = Math.round(-(this._topicDesc.width / Responsive.RATIO) / 2);
        this._topicDesc.y = Math.round(this._radius + 50);

        // topic issue elements
        var issue;
        var i;
        var tH = ((this._topicTitle.height / Responsive.RATIO) / 2) + 5; // half title height
        for(i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.setTextAlwaysVisible(false);
            issue.setIsInteractive(false);

            issue.topicX = (Math.random() * this._radius * 2) - this._radius;
             // from -(radius - tH / 2) to (radius - tH / 2)
            issue.topicY = (Math.random() * (this._radius - tH) * 2) - (this._radius - tH);
            // dont go between -tH/2 and tH/2 (the title area)
            issue.topicY += tH * (issue.topicY > 0 ? 1 : -1);
        }

        for(i = 0; i < this._fakes.length; i ++) {
            issue = this._fakes[i];
            issue.topicX = (Math.random() * this._radius * 2) - this._radius;
            issue.topicY = (Math.random() * this._radius * 2) - this._radius;
        }

        return this;
    };

    Topic.prototype.show = function () {
        var issue;
        var i;
        for(i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.setMode(Issue.MODE_TOPICS);
            issue.moveTo(
                this.elm.x + issue.topicX,
                this.elm.y + issue.topicY,
                issue._resumeStaticAnimation.bind(issue),
                {alpha: 1});
            issue.topicMouseOver = this._mouseOverIssue.bind(this);
            issue.topicMouseOut = this._mouseOutIssue.bind(this);
            issue.topicTap = this._tapIssue.bind(this);
            issue.mouseOverS.add(issue.topicMouseOver);
            issue.mouseOutS.add(issue.topicMouseOut);
            issue.pressS.add(issue.topicTap);
            issue.tapS.add(issue.topicTap);
        }

        for(i = 0; i < this._fakes.length; i ++) {
            issue = this._fakes[i];
            issue.exploded = false;
            gs.TweenMax.to(
                issue.elm,
                0.3,
                {
                    alpha: 1,
                    x: this.elm.x + issue.topicX,
                    y: this.elm.y + issue.topicY,
                    overwrite: true, roundProps: 'x,y'
                }
            );
        }
    };

    Topic.prototype.hide = function () {
        var issue;
        var i;

        for(i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.mouseOverS.remove(issue.topicMouseOver);
            issue.mouseOutS.remove(issue.topicMouseOut);
            issue.pressS.remove(issue.topicTap);
            issue.tapS.remove(issue.topicTap);
        }

        for(i = 0; i < this._fakes.length; i ++) {
            this._fakes[i].explode();
        }
    };

    Topic.prototype._mouseOverIssue = function (issue) {
        if (this.isOver) {
            this.selectedIssue = issue;
            issue.mouseOver(this.mousePosition);
        }
    };

    Topic.prototype._mouseOutIssue = function (issue) {
        if (this.isOver) {
            this.selectedIssue = null;
            issue.mouseOut();
        }
    };

    Topic.prototype._tapIssue = function (issue) {
        issue._onMouseOver();
        setTimeout(function () {
            this._mouseOut();
            issue._onMouseOut();
            issue._onPress();
        }.bind(this), 200);
    };

    /**
    * When hovering a topic
    */
    Topic.prototype._mouseOver = function () {
        // dont mouse in if theres another one still selected
        // if (Topic.SELECTED_TOPIC) {
        //     return;
        // }

        Topic.SELECTED_TOPIC = this;

        var i;
        var issue;

        // move issues to a linear position
        var posX;
        var posY;
        for(i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.setTextAlwaysVisible(true);
            issue.stopMoving();
            issue.stopPulsing();
            posX = this.elm.x + this._linearArea.x;
            posY = this.elm.y + this._linearArea.y;
            posY += (((this._linearDist * i) - this._linearDist * this._issues.length / 2));
            issue.moveTo(Math.round(posX), Math.round(posY), null, {alpha: 1});
        }

        // hide fakes
        for(i = 0; i < this._fakes.length; i ++) {
            issue = this._fakes[i];
            issue.implodeAlpha = issue.elm.alpha;
            gs.TweenMax.to(issue.elm, 0.3, {alpha: 0, overwrite: true});
        }

        // move selected title and desc
        posY = -this._linearDist * this._issues.length / 2;
        posY -= (this._topicTitle.height / Responsive.RATIO) + 50;
        gs.TweenMax.to(this._topicTitle, 0.3, {y: posY, alpha: 0, overwrite: true});
        gs.TweenMax.to(this._topicDesc, 0.3, {alpha: 0, overwrite: true});
        // this._linearArea.mouseout = this._linearArea.touchend = this._mouseOut.bind(this);

        setTimeout(function () {
            this.elm.removeChild(this._topicArea);
            this.isOver = true;
        }.bind(this), 600);

        this.mouseOverS.dispatch(this);
    };

    /**
    * When the mouse leaves a topic
    */
    Topic.prototype._mouseOut = function () {
        // dont mouse out if it's animating in
        if (Topic.SELECTED_TOPIC && !this.isOver) {
            return;
        }

        var i;
        var issue;

        // move selected title and desc
        gs.TweenMax.to(
            this._topicTitle,
            0.3,
            {
                y: Math.round(-(this._topicTitle.height / Responsive.RATIO) / 2),
                tint: 0xFFFFFF,
                alpha: 1,
                overwrite: true
            }
        );
        gs.TweenMax.to(this._topicDesc, 0.3, {alpha: 1, overwrite: true});

        // show fakes
        for(i = 0; i < this._fakes.length; i ++) {
            issue = this._fakes[i];
            gs.TweenMax.to(issue.elm, 0.3, {alpha: issue.implodeAlpha, overwrite: true});
        }

        for(i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.mouseOut();
            issue.setTextAlwaysVisible(false);
            issue.moveTo(
                this.elm.x + issue.topicX,
                this.elm.y + issue.topicY,
                issue._resumeStaticAnimation.bind(issue),
                {alpha: 1});
        }

        this.isOver = false;

        setTimeout(function () {
            this.elm.addChild(this._topicArea);
            Topic.SELECTED_TOPIC = null;
        }.bind(this), 600);

        this.mouseOutS.dispatch(this);
    };

    Topic.prototype.toneDown = function () {
        gs.TweenMax.to(this._topicTitle, 0.3, {alpha: 0.5});
        gs.TweenMax.to(this._topicDesc, 0.3, {alpha: 0.5});

        for(var i = 0; i < this._issues.length; i ++) {
            gs.TweenMax.to(this._issues[i].elm, 0.3, {alpha: 0.5});
        }
    };

    Topic.prototype.endToneDown = function () {
        gs.TweenMax.to(this._topicTitle, 0.3, {alpha: 1});
        gs.TweenMax.to(this._topicDesc, 0.3, {alpha: 1});

        for(var i = 0; i < this._issues.length; i ++) {
            gs.TweenMax.to(this._issues[i].elm, 1, {alpha: 1});
        }
    };

    Topic.prototype.moveTo = function (position) {
        var i;
        var issue;

        this._topicArea.mouseover = this._topicArea.touchstart = null;

        gs.TweenMax.to(
            this.elm,
            0.3,
            {x:position.x, y:position.y, overwrite: true, roundProps: 'x,y', ease: gs.Elastic.easeOut.config(2, 0.7)}
        );

        for(i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.moveTo(position.x + issue.topicX, position.y + issue.topicY, issue._resumeStaticAnimation.bind(issue));
        }

        for(i = 0; i < this._fakes.length; i ++) {
            issue = this._fakes[i];
            gs.TweenMax.to(
                issue.elm,
                0.3,
                {
                    alpha: issue.implodeAlpha,
                    x: position.x + issue.topicX,
                    y: position.y + issue.topicY,
                    overwrite: true, roundProps: 'x,y'
                }
            );
        }

        setTimeout(function resumeEvents () {
            this._topicArea.mouseover = this._topicArea.touchstart = this._mouseOver.bind(this);
        }.bind(this), 5000);
    };

    Topic.prototype.update = function (mousePosition) {
        this.mousePosition = mousePosition;
        if (this.isOver) {
            // check for mouse out
            var x0 = this.elm.x + this._linearArea.x + this._linearArea.hitArea.x;
            var x1 = x0 + this._linearArea.hitArea.width;
            var y0 = this.elm.y + this._linearArea.y + this._linearArea.hitArea.y;
            var y1 = y0 + this._linearArea.hitArea.height;

            if (mousePosition.x < x0 || mousePosition.x > x1 ||
                mousePosition.y < y0 || mousePosition.y > y1) {
                this._mouseOut();
            }
        }
    };

    return Topic;
});
