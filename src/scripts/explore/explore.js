/* global define:true */
define([
    'pixi',
    'stats',
    'createjs',
    'explore/issue',
    'explore/circle',
    'explore/topic'
], function (
    PIXI,
    Stats,
    createjs,
    Issue,
    Circle,
    Topic
) {
    'use strict';

    var Explore = function () {
        return {
            setContainer: this.setContainer.bind(this),
            init: this.init.bind(this),
            setData: this.setData.bind(this),
            showExplore: this.showExplore.bind(this),
            showTopics: this.showTopics.bind(this),
            showIssues: this.showIssues.bind(this),
            setEnterIssueCallback: this.setEnterIssueCallback.bind(this)
        };
    };

    Explore.prototype.init = function (isDebug) {
        // FPS count for debuggingg
        if (isDebug) {
            this._stats = new Stats();
            this._showStats();
        }

        this._issues = [];
        this._tags = [];
        this._fakes = [];
        this._topics = [];

        // this._issueData;
        // this._tagData;

        this._lastTick = 0;
        this._mode = Issue.MODE_EXPLORE;

        // this._autoMode;
        // this._autoModeTimeout;
        // this._autoModeIssue;
        this._autoModeTime = 8000;
        this._autoModeTimeUp = 3000;

        // this._mousePosition;
    };

    Explore.prototype.setData = function (data) {
        this._issueData = data.getIssues();
        this._tagData = data.getTags();
        this._topicsData = data.getTopics();
    };

    /**
    * Sets HTML element for PIXI container
    * @param  {object} DOM object
    */
    Explore.prototype.setContainer = function (container) {
        this._canvasSize = {x: container.width(), y: container.height()};

        // create pixijs renderer and stage
        this._renderer = new PIXI.CanvasRenderer(
            this._canvasSize.x,
            this._canvasSize.y,
            {transparent: true, antialias: true});
        this._stage = new PIXI.Stage();
        this._stage.interactive = true;
        container.append(this._renderer.view);

        // lines
        this._linesContainer = new PIXI.Graphics();
        this._linesContainer.x = Math.round(this._renderer.width / 2);
        this._linesContainer.y = Math.round(this._renderer.height / 2);
        this._stage.addChild(this._linesContainer);

        // circles
        var dimension = Math.min(this._canvasSize.x, this._canvasSize.y);
        this._exploreRadius = dimension / 2;
        this._issuesContainer = new PIXI.DisplayObjectContainer();
        this._issuesContainer.interactive = true;
        this._issuesContainer.x = this._linesContainer.x;
        this._issuesContainer.y = this._linesContainer.y;
        this._stage.addChild(this._issuesContainer);

        // topics hover areas
        this._topicsContainer = new PIXI.DisplayObjectContainer();
        this._topicsContainer.x = this._linesContainer.x;
        this._topicsContainer.y = this._linesContainer.y;
        this._stage.addChild(this._topicsContainer);

        this._scrollPosition = this._scrollFinalPosition = 0;

        this._issueMargin = 80;

        this._scrollArea = new PIXI.Rectangle(
            -((this._renderer.width - 400) / 2),
            -((this._renderer.height - 200) / 2),
            this._renderer.width - 400,
            this._renderer.height - 200
        );

        this._drawFakes();
        this._drawIssues();
        this._drawTags();

        // start animation
        requestAnimationFrame(this._animate.bind(this));

        this._autoModeTimeout = setTimeout(
            this._startAutoMode.bind(this),
            this._autoModeTime
        );

        this._stage.touchstart = this._onTouchStart.bind(this);
    };

    Explore.prototype.setEnterIssueCallback = function (enterIssueCallback) {
        this.enterIssueCallback = enterIssueCallback;
    };

    Explore.prototype._startAutoMode = function () {
        this._autoMode = true;

        this._autoModeIssue = this._issues[Math.floor(Math.random() * this._issues.length)];
        this._mouseOverIssue(this._autoModeIssue);

        clearTimeout(this._autoModeTimeout);
        this._autoModeTimeout = setTimeout(
            this._endAutoMode.bind(this),
            this._autoModeTimeUp,
            true
        );
    };

    Explore.prototype._endAutoMode = function (startAnother) {
        if (this._autoModeIssue) {
            this._mouseOutIssue(this._autoModeIssue);
        }

        this._autoMode = false;

        clearTimeout(this._autoModeTimeout);
        if (startAnother) {
            this._autoModeTimeout = setTimeout(
                this._startAutoMode.bind(this),
                this._autoModeTime
            );
        }
    };

    Explore.prototype._clearTopics = function () {
        if (this._topicsContainer.parent) {
            this._stage.removeChild(this._topicsContainer);
        }

        var issue;
        var i;
        for(i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            createjs.Tween.get(issue.elm, {override: true})
                .to({alpha: 1}, 300, createjs.Ease.quartIn);
        }
    };

    /**
    * Shows FPS count
    */
    Explore.prototype._showStats = function () {
        this._stats.setMode(0);
        this._stats.domElement.style.position = 'absolute';
        this._stats.domElement.style.left = '0px';
        this._stats.domElement.style.top = '0px';
        document.body.appendChild(this._stats.domElement);
    };

    /**
    * Go to explore mode
    */
    Explore.prototype.showExplore = function () {
        this._clearTopics();
        this._startAutoMode();

        createjs.Tween.get(this._linesContainer)
            .to({alpha:0}, 300, createjs.Ease.quartOut)
            .to({alpha:1}, 300, createjs.Ease.quartIn);

        this._mode = Issue.MODE_EXPLORE;

        var issue;
        var i;
        for (i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.setMode(Issue.MODE_EXPLORE);
            issue.moveTo(issue.exploreX, issue.exploreY)
                .call(issue._resumeStaticAnimation.bind(issue));
        }

        for (i = 0; i < this._tags.length; i ++) {
            this._tags[i].implode();
        }

        for (i = 0; i < this._fakes.length; i ++) {
            this._fakes[i].implode();
        }
    };

    /**
    * Go to issues mode
    */
    Explore.prototype.showIssues = function () {
        this._clearTopics();

        createjs.Tween.get(this._linesContainer)
            .to({alpha:0}, 300, createjs.Ease.quartOut)
            .to({alpha:1}, 300, createjs.Ease.quartIn);

        this._mode = Issue.MODE_ISSUES;
        this._endAutoMode(false);

        var issue;
        var i;
        for (i = 0; i < this._tags.length; i ++) {
            this._tags[i].explode(this._exploreRadius);
        }

        for (i = 0; i < this._fakes.length; i ++) {
            this._fakes[i].explode(this._exploreRadius);
        }

        for(i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.setMode(Issue.MODE_ISSUES);
            issue.issueX = this._scrollArea.x;
            issue.issueY = this._scrollArea.y + (this._issueMargin * i);
            issue.moveTo(issue.issueX, issue.issueY);
        }
    };

    /**
    * Go to topics mode
    */
    Explore.prototype.showTopics = function () {
        createjs.Tween.get(this._linesContainer)
            .to({alpha:0}, 400, createjs.Ease.quartOut)
            .to({alpha:1}, 400, createjs.Ease.quartIn);

        this._mode = Issue.MODE_TOPICS;
        this._endAutoMode(false);

        this._stage.addChild(this._topicsContainer);

        var i;
        var j;
        var issue;

        for (i = 0; i < this._tags.length; i ++) {
            this._tags[i].explode(this._exploreRadius);
        }

        for (i = 0; i < this._fakes.length; i ++) {
            this._fakes[i].explode(this._exploreRadius);
        }

        for(i = 0; i < this._topicsData.length; i ++) {
            if (!this._topics[i]) {
                // get issue elements for topic
                var issues = [];
                for(j = 0; j < this._topicsData[i]._issues.length; j ++) {
                    issue = this._getElementFromId(this._topicsData[i]._issues[j]._id);
                    issues.push(issue);
                }

                var fakes = [];
                for(j = 0; j < Math.floor(Math.random() * 10) + 20; j ++) {
                    issue = this._getRandomFake();
                    fakes.push(issue);
                }

                this._topics[i] = new Topic(this._topicsData[i], i, issues, fakes);
                this._topicsContainer.addChild(this._topics[i].elm);

                if (this._renderer.width > 960) {
                    this._topics[i].elm.x = (this._renderer.width - 400) /
                        (this._topicsData.length - 1) * i;
                    this._topics[i].elm.x -= ((this._renderer.width - 400) / 2);
                    this._topics[i].elm.y = 0;
                    this._topics[i].elm.x = Math.round(this._topics[i].elm.x);
                    this._topics[i].elm.y = Math.round(this._topics[i].elm.y);
                } else {
                    this._topics[i].elm.x = (this._renderer.width - 500) * (i % 2);
                    this._topics[i].elm.x -= ((this._renderer.width - 500) / 2);
                    this._topics[i].elm.y =  (350 * Math.floor(i / 2)) - 350;
                    this._topics[i].elm.x = Math.round(this._topics[i].elm.x);
                    this._topics[i].elm.y = Math.round(this._topics[i].elm.y);
                }

                this._topics[i].setup();
            }

            this._topics[i].show();
        }
    };

    // get random fakes for topic
    Explore.prototype._getRandomFake = function () {
        return this._fakes[Math.floor(Math.random() * this._fakes.length)];
    };

    /**
    * Draw dull circles on canvas
    */
    Explore.prototype._drawFakes = function () {
        var seed;
        var rSeed;
        var circle;
        for (var i = 0; i < 200; i ++) {
            seed = Math.random() * Math.PI * 2;
            rSeed = Math.pow(Math.random(), 1/3) * (this._exploreRadius - 20);

            circle = new Circle();

            this._fakes.push(circle);
            this._issuesContainer.addChild(circle.elm);

            circle.draw(1, Math.sin(seed) * rSeed, Math.cos(seed) * rSeed);
            circle.elm.alpha = 0.1 + (0.3 * rSeed / this._exploreRadius);
        }
    };

    /**
    * Draw tags on canvas
    */
    Explore.prototype._drawTags = function () {
        var seed;
        var rSeed;
        var tag;
        for (var i = 0; i < this._tagData.length; i ++) {
            seed = Math.random() * Math.PI * 2;
            rSeed = this._exploreRadius + (Math.random() * 5);

            tag = new Issue(i, this._canvasSize);
            tag.setIsInteractive(false);

            this._tags.push(tag);
            this._issuesContainer.addChild(tag.elm);

            tag.setData(this._tagData[i]);
            tag.draw(2, Math.sin(seed) * rSeed, Math.cos(seed) * rSeed);

            tag.elm.mouseover = this._onOverTag.bind(this);
            tag.elm.mouseout = this._onOutTag.bind(this);
            // tag.elm.mousedown = this._onPressIssue.bind(this);
            tag.isInteractive = false;
        }
    };

    /**
    * Draw issues on canvas
    */
    Explore.prototype._drawIssues = function () {
        var seed;
        var rSeed;
        var issue;
        for (var i = 0; i < this._issueData.length; i ++) {
            seed = Math.random() * Math.PI * 2;
            rSeed = Math.pow(Math.random(), 1/2) * (this._exploreRadius - 20);

            issue = new Issue(i, this._canvasSize);

            this._issues.push(issue);
            this._issuesContainer.addChild(issue.elm);

            issue.setData(this._issueData[i]);
            issue.draw(
                8 - rSeed / this._exploreRadius * 5,
                Math.sin(seed) * rSeed,
                Math.cos(seed) * rSeed
            );

            issue.exploreX = issue.elm.x;
            issue.exploreY = issue.elm.y;

            issue.elm.mouseover = issue.elm.touchstart = this._onOverIssue.bind(this);
            issue.elm.mouseout = this._onOutIssue.bind(this);
            issue.elm.mousedown = this._onPressIssue.bind(this);
        }
    };

    Explore.prototype._onOverTag = function (event) {
        this._mouseOverIssue(this._tags[event.target.index]);
    };

    Explore.prototype._onOutTag = function (event) {
        this._mouseOutIssue(this._tags[event.target.index]);
    };

    Explore.prototype._onOverIssue = function (event) {
        this._mouseOverIssue(this._issues[event.target.index]);
    };

    Explore.prototype._onOutIssue = function (event) {
        this._mouseOutIssue(this._issues[event.target.index]);
    };

    Explore.prototype._onPressIssue = function (event) {
        this._mode = Issue.MODE_DETAIL;

        if (this.enterIssueCallback) {
            var issueData = this._issueData[event.target.index];
            var issue = this._getElementFromId(issueData.getId());
            issue.openIssue();
            this.enterIssueCallback(issueData.getParent().getId(), issueData.getId());
        }
    };

    Explore.prototype._mouseOverIssue = function (issue) {
        var related;
        var relatedIssue;
        var isSameTopic;
        var i;

        if (this._mode !== Issue.MODE_ISSUES) {
            issue.mouseOver.bind(issue)();

            related = issue.data.getRelated();
            for(i = 0; i < related.length; i ++) {
                relatedIssue = this._getElementFromId(related[i]._id);
                isSameTopic = issue.data._parent._id === relatedIssue.data._parent._id;
                if (this._mode !== Issue.MODE_TOPICS) {
                    relatedIssue.lightUp();
                }
            }
        } else {
            issue.issueModeMouseOver.bind(issue)();
        }
    };

    Explore.prototype._mouseOutIssue = function (issue) {
        var related;
        var relatedIssue;
        var i;

        if (this._mode !== Issue.MODE_ISSUES) {
            if (!issue.isInteractive || this._autoMode) {
                issue.mouseOut.bind(issue)();
            }

            related = issue.data.getRelated();
            for(i = 0; i < related.length; i ++) {
                relatedIssue = this._getElementFromId(related[i]._id);
                relatedIssue.lightDown();
            }
        } else {
            issue.issueModeMouseOut.bind(issue)();
        }
    };

    /**
    * Draw connecting lines
    */
    Explore.prototype._drawLines = function () {
        this._linesContainer.clear();
        var isOver;
        var isSameTopic;
        var issue;
        var related;
        var tags;
        var relatedItem;
        var i;
        var j;
        for (i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            related = this._issues[i].data.getRelated();
            tags = this._issues[i].data.getTags();

            if (this._mode === Issue.MODE_EXPLORE || this._mode === Issue.MODE_TOPICS) {
                for (j = 0; j < related.length; j ++) {
                    relatedItem = this._getElementFromId(related[j]._id);

                    isOver = (issue.isOver || relatedItem.isOver);
                    isSameTopic = issue.data._parent._id === relatedItem.data._parent._id;
                    // only show related on same topic if on topics
                    if (this._mode === Issue.MODE_EXPLORE || isSameTopic) {
                        if (isOver && this._mode !== Issue.MODE_TOPICS) {
                            this._linesContainer.lineStyle(1, 0x000000,  0.15);
                        } else {
                            this._linesContainer.lineStyle(1, 0x000000, 0.03);
                        }

                        this._linesContainer.moveTo(issue.elm.x, issue.elm.y);
                        this._linesContainer.lineTo(relatedItem.elm.x, relatedItem.elm.y);
                    }
                }
            }

            // connect to tags on explore
            if (this._mode === Issue.MODE_EXPLORE) {
                for (j = 0; j < tags.length; j ++) {
                    relatedItem = this._getElementFromId(tags[j]._id);

                    isOver = (issue.isOver || relatedItem.isOver);
                    if (isOver) {
                        this._linesContainer.lineStyle(1, 0x000000,  0.15);
                    } else {
                        this._linesContainer.lineStyle(1, 0x000000, 0.03);
                    }

                    this._linesContainer.moveTo(issue.elm.x, issue.elm.y);
                    this._linesContainer.lineTo(relatedItem.elm.x, relatedItem.elm.y);
                }
            }

            // connect to next in line on issues
            if (this._mode === Issue.MODE_ISSUES && i < this._issues.length - 1) {
                relatedItem = this._issues[i + 1];
                this._linesContainer.lineStyle(1, 0x000000, 0.15);
                this._linesContainer.moveTo(issue.elm.x, issue.elm.y);
                this._linesContainer.lineTo(relatedItem.elm.x, relatedItem.elm.y);
            }
        }
    };

    /**
    * Get visual element from id
    */
    Explore.prototype._getElementFromId = function (id) {
        var i;

        for (i = 0; i < this._issues.length; i ++) {
            if (this._issues[i].data._id === id) {
                return this._issues[i];
            }
        }

        for (i = 0; i < this._tags.length; i ++) {
            if (this._tags[i].data._id === id) {
                return this._tags[i];
            }
        }
    };

    /**
     * update issue positions
     */
    Explore.prototype._updatePositions = function (mousePosition) {
        for (var i = 0; i < this._issues.length; i ++) {
            this._issues[i].update(mousePosition);
        }
    };

    Explore.prototype._updateTopics = function (mousePosition) {
        for (var i = 0; i < this._topics.length; i ++) {
            this._topics[i].update(mousePosition);
        }
    };

    Explore.prototype._updateScroller = function (mousePosition) {
        // no movement if mouse is out of the canvas
        if (mousePosition.y > this._canvasSize.y ||
            mousePosition.y < -this._canvasSize.y) {
            mousePosition.y = 0;
        }

        // using tan so the movement is smoother
        var tanMouse = Math.tan(mousePosition.y / this._canvasSize.y * Math.PI / 2);

        // no movement if mouse is near the center
        if (Math.abs(tanMouse) < 0.5) {
            tanMouse = 0;
        }

        this._scrollFinalPosition -= tanMouse * 8;

        this._scrollFinalPosition = Math.max(
            Math.min(this._scrollFinalPosition, 0),
            (-(this._scrollArea.y + (this._issueMargin * this._issues.length)) +
            this._scrollArea.height - 200)
        );

        this._scrollPosition += (this._scrollFinalPosition - this._scrollPosition) / 5;

        var i;
        var issue;
        for (i = 0; i < this._issues.length; i ++) {
            issue = this._issues[i];
            issue.elm.y = issue.issueY + this._scrollPosition;
            // issue.elm.alpha = ((1 - Math.abs(issue.elm.y / this._scrollArea.height))) + 0.3;
        }
    };

    Explore.prototype._onTouchStart = function (event) {
        this._touchPosition = event.global;
    };

    /**
     * do animation cycle
     */
    Explore.prototype._animate = function (tick) {
        if (this._stats) {
            this._stats.begin();
        }

        createjs.Tween.tick(tick - this._lastTick);
        this._lastTick = tick;

        // mouse position relative to issues container
        var mousePosition = this._stage.getMousePosition().clone();

        // get position from touch if theres one
        if (this._touchPosition) {
            mousePosition = this._touchPosition.clone();
        }

        mousePosition.x -= this._issuesContainer.x;
        mousePosition.y -= this._issuesContainer.y;

        var lastMouse = this._mousePosition;
        this._mousePosition = mousePosition.clone();

        // ends auto mode
        if (lastMouse &&
            (Math.abs(lastMouse.x - this._mousePosition.x) > 2 ||
            Math.abs(lastMouse.y - this._mousePosition.y) > 2)) {
            this._endAutoMode(this._mode === Issue.MODE_EXPLORE);
        }

        // sets mouse position as selected issues position
        if (this._autoMode) {
            mousePosition.x = this._autoModeIssue._x0;
            mousePosition.y = this._autoModeIssue._y0;
        }

        this._updatePositions(mousePosition);

        if (this._mode === Issue.MODE_TOPICS) {
            this._updateTopics(mousePosition);
        } else if (this._mode === Issue.MODE_ISSUES) {
            this._updateScroller(mousePosition);
        }

        this._drawLines();
        this._renderer.render(this._stage);

        if (this._stats) {
            this._stats.end();
        }
        requestAnimationFrame(this._animate.bind(this));
    };

    return Explore;
});