/**
 * @fileOverview Issue all directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery', 'webfontloader', 'jquery-scrollie'], function ($, WebFont) {
    'use strict';

    /**
     * Issue All directive
     */
    var IssueAllDirective = function () {
        return {
            restrict: 'A',
            scope: true,
            controller: IssueAllCtrl,
            link: IssueAllLinkFn,
            templateUrl: '/app/lorax/directives/issue-all.tpl.html'
        };
    };

    /**
     * Controller for issue all directive
     * @constructor
     */
    var IssueAllCtrl = function (
        $scope,
        $timeout,
        dataService,
        windowService,
        scrollService,
        pubSubService,
        experienceService
    ) {

        this._$scope = $scope;
        this._$timeout = $timeout;
        this._dataService = dataService;
        this._windowService = windowService;
        this._scrollService = scrollService;
        this._pubSubService = pubSubService;
        this._experienceService = experienceService;

        this._$scope.detail = {
            currentIssue : '',
            scrollTo: this.scrollToIssue.bind(this),
            nextIssue: this.nextIssue.bind(this)
        };

        this._issueOffset = 138;

        // get model
        this._dataService.getMain().then(this.onModelLoaded.bind(this));

        this._pubSubService.subscribe('detail.scrollToIssue', this.scrollToIssue.bind(this));
    };

    IssueAllCtrl.$inject = [
        '$scope',
        '$timeout',
        'dataService',
        'windowService',
        'scrollService',
        'pubSubService',
        'experienceService'
    ];

    IssueAllCtrl.prototype.init = function () {
        WebFont.load({
            active: this.onFontsLoaded.bind(this),
            custom: {families: ['Fira Sans:n2,n3,n4,n5,n6,n7,n8,n9']}
        });
    };

    IssueAllCtrl.prototype.onFontsLoaded = function () {
        this.fontsLoaded = true;

        if (this._$scope.detail.model) {
            this.setOffsets();
        }
    };

    IssueAllCtrl.prototype.onModelLoaded = function (model) {
        this._$scope.detail.model = model;

        if (this.fontsLoaded) {
            this.setOffsets();
        }
    };

    IssueAllCtrl.prototype.setOffsets = function () {
        var issues = this._$scope.detail.model.getIssues();
        var issue;
        var issueElm;
        var issueTitle;

        // hack
        var detailIsHidden = $('#detail').hasClass('ng-hide');
        $('#detail').removeClass('ng-hide');

        // set offset property of all issues
        for (var i = 0; i < issues.length; i ++) {
            issue = issues[i];
            issueElm = $('#' + issue.getId());
            issueTitle = $('.detail-header-section', issueElm);
            issue.offset = issueElm.offset();
            issue.titleOffset = issueTitle.offset();
        }

        if (detailIsHidden) {
            $('#detail').addClass('ng-hide');
        }

        this.initialized = true;

        this.onScroll();
        if (this.issue || this.topic) {
            this._doScrollToIssue();
        }
    };

    IssueAllCtrl.prototype.scrollToIssue = function (issue, topic) {
        this.issue = issue;
        this.topic = topic;

        if (this.initialized) {
            this._doScrollToIssue();
        }
    };

    IssueAllCtrl.prototype._doScrollToIssue = function () {
        // get first issue from topic
        if (this.topic && !this.issue) {
            this.issue = this._$scope.detail.model.getTopicById(this.topic).getIssues()[0].getId();
        }

        // find issue offset
        var offset = 0;
        if (this.issue) {
            offset = this._$scope.detail.model.getIssueById(this.issue).offset.top - this._issueOffset;
        }

        // scroll to offset
        this._scrollService.go('top', {offset: offset, animate: false});

        this._$scope.detail.currentIssue = this.issue;
    };

    IssueAllCtrl.prototype.onScroll = function () {
        this._experienceService.onScroll($(window, 'body').scrollTop());
    };

    IssueAllCtrl.prototype.nextIssue = function () {
        this._$scope.detail.currentIssue =
            $('#' + this._$scope.detail.currentIssue).next().attr('id');

        if (this._$scope.detail.currentIssue) {
            this._$scope.detail.scrollTo(this._$scope.detail.currentIssue);
        }
    };

    /**
     * Link function for Issue All directive
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      Detail wrapper jQuery element.
     */
    var IssueAllLinkFn = function (scope, iElem, iAttrs, controller) {

        // wait for everything to be rendered
        controller._$timeout(function () {

            // change bg mode according to issue
            var $body = $('body');
            var $detail = $('.detail');
            var status;

            $detail.scrollie({
                scrollOffset : controller._issueOffset,
                ScrollingOutOfView : function onScrollOutOfView (elem) {
                    status = elem.attr('data-issue-status');
                    controller._windowService.setBgMode(status);
                }
            });

            // update experience scroll
            $(window, 'body').on('scroll', controller.onScroll.bind(controller));

            controller.init();
        }, 500);
    };

    return IssueAllDirective;
});
