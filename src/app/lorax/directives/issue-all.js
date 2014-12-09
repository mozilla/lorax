/**
 * @fileOverview Issue all directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery', 'webfontloader'], function ($, WebFont) {
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

        this._downArrowOpacity = 1.0;

        this._issueOffset = {
            'small': 60,
            'medium': 100,
            'large': 125,
            'xlarge': 138
        };

        this._onScrollBind = this.onScroll.bind(this);

        // get model
        this._dataService.getMain().then(this.onModelLoaded.bind(this));

        this._pubSubService.subscribe('detail.scrollToIssue', this.scrollToIssue.bind(this));
        this._pubSubService.subscribe('detail.open', this.open.bind(this));
        this._pubSubService.subscribe('detail.close', this.close.bind(this));
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

    IssueAllCtrl.prototype.open = function () {
        $(window).on('scroll', this._onScrollBind);
    };

    IssueAllCtrl.prototype.close = function () {
        $(window).off('scroll', this._onScrollBind);
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

        // don't do it unless needed
        var lastIssue = issues[issues.length - 1];
        if (lastIssue.offset && lastIssue.offset.top === $('#' + lastIssue.getId()).offset().top) {
            return;
        }

        // set offset property of all issues
        for (var i = 0; i < issues.length; i ++) {
            issue = issues[i];
            issueElm = $('#' + issue.getId());
            issueTitle = $('.detail-header-section', issueElm);
            issue.offset = issueElm.offset();
            issue.titleOffset = issueTitle.offset();
        }

        this._experienceService.setMenuPositions();

        // redirect svg fill so it works on ff
        var fill = $('rect', '.banner-nav-bg');
        var fillValue = fill.attr('fill');
        fill.attr('fill', '');
        fill.attr('fill', fillValue);

        if (detailIsHidden) {
            $('#detail').addClass('ng-hide');
        }

        this.initialized = true;

        if (this.issue || this.topic) {
            this._doScrollToIssue();
        }
    };

    IssueAllCtrl.prototype.scrollToIssue = function (issue, topic) {
        this.issue = issue;
        this.topic = topic;

        if ($('.detail').length === 0) {
            return;
        }

        var scrollTop = $(window).scrollTop();

        var currentElm = $('.detail')[0];
        $('.detail').each(function (index, elm) {
            if (elm.offsetTop - 100 >= scrollTop) {
                return false;
            }
            currentElm = elm;
        });

        var status = currentElm.attributes['data-issue-status'].value;

        if (status !== this._currentStatus) {
            this._windowService.setBgMode(status);
            this._currentStatus = status;
        }

        if (this.initialized) {
            this._doScrollToIssue();
        }
    };

    IssueAllCtrl.prototype._doScrollToIssue = function () {
        this.setOffsets(); // just to be sure

        this._currentStatus = null;

        // get first issue from topic
        if (this.topic && !this.issue) {
            this.issue = this._$scope.detail.model.getTopicById(this.topic).getIssues()[0].getId();
        }

        // find issue offset
        var offset = 0;
        if (this.issue) {
            offset = this._$scope.detail.model.getIssueById(this.issue).offset.top - this._issueOffset[this._windowService.breakpoint()];
        }

        offset = Math.max(1, offset);

        // scroll to offset
        if (!this._scrolled) {
            this._scrollService.go('top', {offset: offset, animate: false});
        }
        this._scrolled = false;
        this._$scope.detail.currentIssue = this.issue;
    };

    IssueAllCtrl.prototype.nextIssue = function () {
        this._$scope.detail.currentIssue =
            $('#' + this._$scope.detail.currentIssue).next().attr('id');

        if (this._$scope.detail.currentIssue) {
            this._$scope.detail.scrollTo(this._$scope.detail.currentIssue);
        }
    };

    IssueAllCtrl.prototype.onScroll = function () {
        var scrollTop = $(window).scrollTop();
        this._experienceService.onScroll(scrollTop);

        var currentElm = $('.detail')[0];
        $('.detail').each(function (index, elm) {
            if (elm.offsetTop - 100 >= scrollTop) {
                return false;
            }
            currentElm = elm;
        });

        var data = this._$scope.detail.model.getIssueById(currentElm.id);
        var status = currentElm.attributes['data-issue-status'].value;

        // if issue changed and it's not right after a scrollToIssue
        if (currentElm.id !== this.issue && this._currentStatus !== null) {
            this._scrolled = true;
            this.issue = currentElm.id;
            this._windowService.setIssue(data);
        }

        if (status !== this._currentStatus) {
            this._windowService.setBgMode(status);
            this._currentStatus = status;
        }

        var topic = data.getParentId();
        if (topic !== this._currentTopic) {
            this._windowService.setTopic(topic);
            this._currentTopic = topic;
        }

        // Fade out the down arrow as we scroll
        this._downArrowOpacity -= 0.005;
        $('.down-arrow-nav').css('opacity', this._downArrowOpacity);
    };

    /**
     * Link function for Issue All directive
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      Detail wrapper jQuery element.
     */
    var IssueAllLinkFn = function (scope, iElem, iAttrs, controller) {

        // wait for everything to be rendered
        // controller._$timeout(function () {
        //     console.log($('.main--detail').children());
        //     controller.init();
        // }, 500);
        var checkRenderedInterval = setInterval(function () {
            controller._$timeout(function () {
                var children = $('.main--detail').children();
                if(children.length && $(children[0]).attr('data-issue-name')) {
                    clearInterval(checkRenderedInterval);
                    controller.init();
                }
            });
        }, 100);
    };

    return IssueAllDirective;
});
