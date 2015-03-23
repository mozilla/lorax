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
        pubSubService,
        experienceService
    ) {

        this._$scope = $scope;
        this._$timeout = $timeout;
        this._dataService = dataService;
        this._windowService = windowService;
        this._pubSubService = pubSubService;
        this._experienceService = experienceService;

        this._$scope.detail = {
            currentIssue : ''
        };

        this._downArrowOpacity = 1.0;

        this._issueOffset = {
            'small': 60,
            'medium': 100,
            'large': 125,
            'xlarge': 138
        };

        // get model
        this._dataService.getMain().then(this.onModelLoaded.bind(this));

        this._pubSubService.subscribe('detail.open', this.open.bind(this));
        this._pubSubService.subscribe('detail.close', this.close.bind(this));
    };

    IssueAllCtrl.$inject = [
        '$scope',
        '$timeout',
        'dataService',
        'windowService',
        'pubSubService',
        'experienceService'
    ];

    IssueAllCtrl.prototype.init = function () {
        WebFont.load({
            active: this.onFontsLoaded.bind(this),
            custom: {families: ['Fira Sans:n2,n3,n4,n5,n6,n7,n8,n9']}
        });
    };

    IssueAllCtrl.prototype.open = function (issue, topic) {
        this.issue = issue;

        var issueModel = this._$scope.detail.model.getIssueById(this.issue);
        this._windowService.setIssueMode(true);
        issueModel._isVisible = true;
        console.log(issueModel);
    };

    IssueAllCtrl.prototype.close = function () {};

    IssueAllCtrl.prototype.onFontsLoaded = function () {
        this.fontsLoaded = true;
    };

    IssueAllCtrl.prototype.onModelLoaded = function (model) {
        this._$scope.detail.model = model;
    };

    /**
     * Link function for Issue All directive
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      Detail wrapper jQuery element.
     */
    var IssueAllLinkFn = function (scope, iElem, iAttrs, controller) {

        // wait for everything to be rendered
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
