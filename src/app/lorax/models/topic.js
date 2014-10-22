define([
  'lorax/models/issue'
], function (
  IssueModel
) {
  'use strict';

  var TopicModel = function (id, data, tags, localeData) {
    this._id = id;
    this._name = localeData.topics[id].name;
    this._tagline = localeData.topics[id].tagline;
    this._issues = [];
    for (var idxIssue in data.issues) {
      this._issues.push(new IssueModel(
        this,
        idxIssue,
        data.issues[idxIssue],
        tags,
        localeData
      ));
    }
  };
  
  TopicModel.prototype.getId = function () {
    return this._id;
  };

  TopicModel.prototype.getName = function () {
    return this._name;
  };

  TopicModel.prototype.getTagline = function () {
    return this._tagline;
  };
  
  TopicModel.prototype.getIssues = function () {
    return this._issues;
  };
  
  return TopicModel;
});

