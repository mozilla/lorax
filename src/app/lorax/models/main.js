define([
    'lodash',
    'lorax/models/topic'
], function (
    _,
    TopicModel
) {
    'use strict';

    var MainModel = function (data, localeData, infographicData) {
        this._topics = [];
        this._modals = localeData.modals;
        this._services = localeData.services;
        this._miscLocale = localeData.misc;

        for (var idxTopic in data.topics) {
            this._topics.push(new TopicModel(
                idxTopic,
                data.topics[idxTopic],
                localeData.topics[idxTopic],
                infographicData,
                localeData
            ));
        }
    };

    MainModel.prototype.getTopics = function () {
        return this._topics;
    };

    MainModel.prototype.getIssues = function () {
        return _.reduce(this._topics, function (result, item) {
            result = result.concat(item.getIssues());
            return result;
        }, []);
    };

    MainModel.prototype.getTopicById = function (id) {
        return _.find(this.getTopics(), function (topic) {
            return topic._id === id;
        });
    };

    MainModel.prototype.getIssueById = function (id) {
        return _.find(this.getIssues(), function (issue) {
            return issue._id === id;
        });
    };

    MainModel.prototype.getModals = function () {
        return this._modals;
    };

    // gets the list of available services and their related
    // content from the JSON in /src/data/i18n/[locale]/main.json
    MainModel.prototype.getServices = function () {
        return this._services;
    };

    MainModel.prototype.getMiscLocale = function () {
        return this._miscLocale;
    };

    return MainModel;
});
