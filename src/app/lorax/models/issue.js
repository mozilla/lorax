define([
  'lodash',
  'lorax/models/tag'
  ], function (
  _,
  TagModel
) {
  'use strict';

  var IssueModel = function (parentInstance, id, data, tags, localeData) {
    this._parent = parentInstance;
    this._id = id;
    this._name = localeData.issues[id].name;
    this._status = data.status;

    this._tags = [];
    for (var tagIdx in data.tags) {
      //TODO: consider changing this to an object instead of an array
      var tagObjs = _.filter(tags, function (tag) {
        return (tag.getId() === data.tags[tagIdx])
      });
      if (tagObjs.length > 0) {
        this._tags.push(tagObjs[0]);
        tagObjs[0].addIssue(this);
      } else {
        var newTag = new TagModel(data.tags[tagIdx], localeData);
        this._tags.push(newTag);
        newTag.addIssue(this);
        tags.push(newTag);
      }
    }
  };

  IssueModel.prototype.getParent = function () {
    return this._parent;
  };

  IssueModel.prototype.getId = function () {
    return this._id;
  };

  IssueModel.prototype.getName = function () {
    return this._name;
  };
  
  IssueModel.prototype.getTags = function () {
    return this._tags;
  };
  
  IssueModel.prototype.getStatus = function () {
    return this._status;
  };

  IssueModel.prototype.getStatusDescription = function () {
    var out = '';
    switch (this._status) {
    case 0:
      out = 'green';
      break;
    case 1:
      out = 'yellow';
      break;
    case 2:
      out = 'red';
      break;
    }
    return out;
  };
  
  return IssueModel;
});