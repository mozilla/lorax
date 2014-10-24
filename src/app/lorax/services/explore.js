define(['jquery'], function ($) {
  'use strict';

  var ExploreService = function () {

  };

  ExploreService.prototype.setCanvas = function (canvas) {
    this._canvas = canvas;
  };

  ExploreService.prototype.switchView = function (view) {
    if (view === 'explore') {
      this._canvas.showExplore();
    } else if (view === 'topics') {
      this._canvas.showTopics();
    } else if (view === 'issues') {
      this._canvas.showIssues();
    }
  };

  return ExploreService;
});
