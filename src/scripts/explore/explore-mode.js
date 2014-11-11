/* global define:true */
define(['explore/mode'], function (Mode) {
    'use strict';

    var ExploreMode = function (canvas) {
        this._canvas = canvas;
    };

    ExploreMode.prototype = Mode.prototype;

    ExploreMode.prototype.init = function () {
        // set explore radius based on smallest canvas dimension
        var dimension = Math.min(this._canvas.canvasSize.x, this._canvas.canvasSize.y);
        this._exploreRadius = dimension / 2;

        // set explore positions
        var seed;
        var rSeed;
        var issue;
        for (var i = 0; i < this._canvas.issues.length; i ++) {
            seed = Math.random() * Math.PI * 2;
            rSeed = Math.pow(Math.random(), 1/2) * (this._exploreRadius - 20);

            issue = this._canvas.issues[i];
            issue.exploreX = Math.sin(seed) * rSeed;
            issue.exploreY = Math.cos(seed) * rSeed;
        };
    };

    Mode.prototype._onStartShow = function () {
        // set position for issues
        var issue;
        var i;

        for (var i = 0; i < this._canvas.issues.length; i ++) {
            issue = this._canvas.issues[i];
            // issue.setMode(Issue.MODE_EXPLORE);
            issue.moveTo(issue.exploreX, issue.exploreY)
                .call(issue._resumeStaticAnimation.bind(issue));
        };
    };

    return ExploreMode;
});