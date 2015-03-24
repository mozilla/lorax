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
        this._linearDist = 35;
        this._linearWidth = 80;
        this.isOver = false;

        this._data = data;
        this._index = index;
        this._issues = issues;
        this._fakes = fakes;

        for (var i  = 0; i < this._issues.length; i++) {
            this._issues[i].topic = this;
        }

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
        var aMargin = 20;
        
        // initial topic area
        var topicArea = new PIXI.Rectangle(
            -this._radius,
            -this._radius,
            this._radius * 2,
            this._radius * 2);

        // area when user enters topic
        this._linearPos = new PIXI.Point(- 100 - (aMargin / 2), 60);
        var linearArea = new PIXI.Rectangle(
            -(this._linearWidth / 2) + this._linearPos.x,
            -(this._linearDist * this._issues.length / 2) - aMargin  + this._linearPos.y,
            this._linearWidth + 100 + aMargin,
            (this._linearDist * this._issues.length) + aMargin);

        // top left and bottom right limits from topic and linear areas
        var x1 = Math.min(linearArea.x, topicArea.x);
        var y1 = Math.min(linearArea.y, topicArea.y);
        var x2 = Math.max(linearArea.x + linearArea.width, topicArea.x + topicArea.width);
        var y2 = Math.max(linearArea.y + linearArea.height, topicArea.y + topicArea.height);

        // union area from topicArea and linearArea
        this._area = new PIXI.Graphics();
        this._area.i = this._index;
        this._area.hitArea = new PIXI.Rectangle(x1, y1, x2 - x1, y2 - y1);
        this._area.interactive = true;
        this._area.buttonMode = true;
        this.elm.addChild(this._area);
        this._area.mouseover = this._area.tap = this._mouseOver.bind(this);
        // DEBUG show areas
        // this._area.beginFill(0x00FF00, 0.8);
        // this._area.drawRect(this._area.hitArea.x, this._area.hitArea.y, this._area.hitArea.width, this._area.hitArea.height);

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
            if (Responsive.IS_SMALL()) {
                issue.mouseEnabled = this.isCurrent;
            }
            issue.setMode(Issue.MODE_TOPICS);
            issue.moveTo(
                this.elm.x + issue.topicX,
                this.elm.y + issue.topicY,
                issue._resumeStaticAnimation.bind(issue),
                {alpha: 1});
            issue.topicMouseOver = this._mouseOverIssue.bind(this);
            issue.topicMouseOut = this._mouseOutIssue.bind(this);
            issue.topicTap = this._tapIssue.bind(this);
            issue.topicPress = this._pressIssue.bind(this);
            issue.mouseOverS.add(issue.topicMouseOver);
            issue.mouseOutS.add(issue.topicMouseOut);
            issue.pressS.add(issue.topicPress, this, 100);
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
            issue.mouseEnabled = true;
            issue.mouseOverS.remove(issue.topicMouseOver);
            issue.mouseOutS.remove(issue.topicMouseOut);
            issue.pressS.remove(issue.topicPress);
            issue.tapS.remove(issue.topicTap);
        }
    };

    Topic.prototype.setCurrent = function (isCurrent) {
        if (Responsive.IS_SMALL()) {
            this.isCurrent = isCurrent;
            for(var i = 0; i < this._issues.length; i ++) {
                this._issues[i].mouseEnabled = this.isCurrent;
            }
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
            this._mouseOut(true);
            issue._onMouseOut();
            issue._onPress();
        }.bind(this), 200);
    };

    Topic.prototype._pressIssue = function () {
        this._mouseOut(true);
    };

    /**
    * When hovering a topic. If force is true, ignore the check to see if this is
    * a valid mouseOver.
    */
    Topic.prototype._mouseOver = function () {
        Topic.SELECTED_TOPIC = this;

        var i;
        var issue;
        var posX;
        var posY;

        // move issues to a linear position
        for(i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.setTextAlwaysVisible(true);
            issue.stopMoving();
            issue.stopPulsing();
            posX = this.elm.x + this._linearPos.x;
            posY = this.elm.y + this._linearPos.y;
            posY += (((this._linearDist * i) - this._linearDist * this._issues.length / 2));
            issue.moveTo(Math.round(posX), Math.round(posY), null, {alpha: 1});
        }

        // move selected title and desc
        posY = -this._linearDist * this._issues.length / 2;
        posY -= (this._topicTitle.height / Responsive.RATIO) + 50 - this._linearPos.y;
        gs.TweenMax.to(this._topicTitle, 0.3, {y: posY, alpha: 0, overwrite: true});
        gs.TweenMax.to(this._topicDesc, 0.3, {alpha: 0, overwrite: true});

        // hide fakes
        for(i = 0; i < this._fakes.length; i ++) {
            issue = this._fakes[i];
            gs.TweenMax.to(issue.elm, 0.3, {alpha: 0, overwrite: true});
        }

        if (this._mouseTimeout) {
            clearTimeout(this._mouseTimeout);
        }
        // update state when the issues stop moving
        this._mouseTimeout = setTimeout(function () {
            if (!this._isMouseOver()) {
                this._mouseOut();
            } else {
                this.isOver = true;
                this._area.mouseover = this._area.tap = null;
                this._area.mouseout = this._area.touchend = this._mouseOut.bind(this);
            }
        }.bind(this), 500);

        this.mouseOverS.dispatch(this);
    };

    /**
    * When the mouse leaves a topic. If force is true, ignore the check to see
    * if this is a valid mouseOut.
    */
    Topic.prototype._mouseOut = function (force) {
        // make sure it's really a mouse out
        if (force !== true && this._isMouseOver()) {
            this._mouseOver();
            return;
        }

        var i;
        var issue;

        // move issues to default position
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

        // show fakes
        for(i = 0; i < this._fakes.length; i ++) {
            issue = this._fakes[i];
            gs.TweenMax.to(issue.elm, 0.3, {alpha: 0.4, overwrite: true});
        }

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

        if (this._mouseTimeout) {
            clearTimeout(this._mouseTimeout);
        }
        // update state when the issues stop moving
        this._mouseTimeout = setTimeout(function () {
            if (this._isMouseOver()) {
                this._mouseOver();
            } else {
                this.isOver = false;
                this._area.mouseout = this._area.touchend = null;
                this._area.mouseover = this._area.tap = this._mouseOver.bind(this);
            }
        }.bind(this), 500);

        this.mouseOutS.dispatch(this);
    };

    Topic.prototype.moveTo = function (position) {
        var i;
        var issue;

        this._area.mouseover = this._area.touchstart = this._area.mouseOut = null;

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
            this._area.mouseover = this._area.touchstart = this._mouseOver.bind(this);
        }.bind(this), 100);
    };

    Topic.prototype._isMouseOver = function () {
        var element = this._area;
        var x0 = this.elm.x + element.x + element.hitArea.x;
        var x1 = x0 + element.hitArea.width;
        var y0 = this.elm.y + element.y + element.hitArea.y;
        var y1 = y0 + element.hitArea.height;

        return !(this.mousePosition.x < x0 || this.mousePosition.x > x1 ||
            this.mousePosition.y < y0 || this.mousePosition.y > y1);
    };

    Topic.prototype.update = function (mousePosition) {
        this.mousePosition = mousePosition;
    };

    return Topic;
});
