/**
 * @fileOverview Share Modal directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['angular', 'jquery'], function (angular, $) {
    'use strict';

    /**
     * Share Modal directive
     */
    var ModalShareDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ModalShareController,
            link: ModalShareLinkFn,
            templateUrl: '/app/lorax/directives/modal-share.tpl.html'
        };
    };

    /**
    * Controller for Share Modal directive
    * @constructor
    */
    var ModalShareController = function (
        $scope,
        $timeout,
        dataService,
        windowService,
        utilsService,
        routesService
    ) {
        this._$scope = $scope;
        this._$timeout = $timeout;
        this._dataService = dataService;
        this._windowService = windowService;
        this._utilsService = utilsService;
        this._routesService = routesService;

        this._offset = {
            'small': -60,
            'medium': -60,
            'large': -30,
            'xlarge': -30
        };

        this._clickPhrase = {
            'small': false,
            'medium': false,
            'large': true,
            'xlarge': true
        };

        $scope.modalShare = {
            open: false,
            service: null,
            closeModal: this.closeModal.bind(this),
            onShare: this.onShare.bind(this),
            shareFacebook: this.shareFacebook.bind(this),
            shareTwitter: this.shareTwitter.bind(this),
            shareEmail: this.shareEmail.bind(this),
            onSecondStep: false,
            backToFirstStep: this.backToFirstStep.bind(this),
            currentIssue: null
        };

        // listen for $broadcast of 'openShareModal'
        $scope.$on('openShareModal', this.openModal.bind(this));

        // get model
        this._dataService.getMain().then(function (model) {
            this._$scope.modalShare.content = model.getModals().share;

            var issuesArray = [];

            angular.forEach(model._topics, function (topic) {
                angular.forEach(topic._issues, function (issue) {
                    issuesArray.push(issue);
                });
            });

            this._$scope.modalShare.issues = issuesArray;
        }.bind(this));
    };

    /**
    * Array of dependencies to be injected into controller
    * @type {Array}
    */
    ModalShareController.$inject = [
        '$scope',
        '$timeout',
        'dataService',
        'windowService',
        'utilsService',
        'routesService'
    ];

    ModalShareController.prototype.openModal = function (e, service) {
        // service = 'twitter', 'email', or 'fb'
        angular.extend(
            this._$scope.modalShare,
            {
                open: true,
                service: service
            }
        );

        this._windowService.setModalOpen(true);

        $.each( this._$scope.modalShare.issues, function(key, data) {
            if (data.getId() === this._routesService.params.issue) {
                this._$scope.modalShare.currentIssue = data;
            }
        }.bind(this));

        // scroll to issue
        // if no issue in focus, e.g. user is on experience, we do nothing
        if (this._$scope.modalShare.currentIssue) {
            var currentIssue = this._$scope.modalShare.currentIssue.getId();
            this._$scope.modalShare.onSecondStep = true;
            this.scrollToIssue(currentIssue);
        }
    };

    ModalShareController.prototype.closeModal = function () {
        this._$scope.modalShare.open = false;
        this._$scope.modalShare.onSecondStep = false;
        this._$scope.modalShare.currentIssue = null;
        this._windowService.setModalOpen(false);
    };

    ModalShareController.prototype.onShare = function (e, issue) {
        // if modal service is 'twitter' or 'fb'
        // prevent the default mailto behavior
        // open new sharing tab/window
        switch (this._$scope.modalShare.service) {
        case 'twitter':
            e.preventDefault();
            this.shareTwitter(issue);
            break;
        case 'fb':
            e.preventDefault(issue);
            this.shareFacebook();
            break;
        // if null, open second step
        case null:
            e.preventDefault();
            this.secondStep(issue);
            break;
        }
    };

    ModalShareController.prototype.shareFacebook = function (issue) {
        ga('send', 'pageview', '/share' + issue.getUrl() + '/facebook/');
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + issue.getShareUrl(), '_blank');
    };

    ModalShareController.prototype.shareTwitter = function (issue) {
        ga('send', 'pageview', '/share' + issue.getUrl() + '/twitter/');
        window.open('http://twitter.com/share?text=' + issue.getTitle() + '&url=' +
            issue.getShareUrl() + '&hashtags=' + this._$scope.modalShare.content.hashtag, '_blank');
    };

    ModalShareController.prototype.shareEmail = function (issue) {
        ga('send', 'pageview', '/share' + issue.getUrl() + '/email/');
        window.open('mailto:?subject=' + encodeURIComponent(issue.getTitle()) + '&body=' + encodeURIComponent(issue.getShareUrl()));
    };

    ModalShareController.prototype.secondStep = function (issue) {
        this._$scope.modalShare.onSecondStep = true;
        var currentIssue = issue.getId();
        this._$scope.modalShare.currentIssue = issue;
        $('.sharing-list__item').addClass('sharing-quote__normal').removeClass('sharing-quote__active');
        var $el = $('[data-id="' + currentIssue + '"]');
        $el.addClass('sharing-quote__active').removeClass('sharing-quote__normal');
    };

    ModalShareController.prototype.backToFirstStep = function () {
        this._$scope.modalShare.onSecondStep = false;
        $('.sharing-list__item').addClass('sharing-quote__normal').removeClass('sharing-quote__active');
    };

    var ModalShareLinkFn = function (scope, iElem, iAttrs, controller) {
        controller.scrollToIssue = function (issue) {
            controller._$timeout(function () {
                var $el = $('[data-id="' + issue + '"]');
                var top = $el.position().top;
                var windowHeight = controller._windowService.getDeviceWindowHeight();
                var offset = -windowHeight/2;
                $('.modal').scrollTop(top + offset);

                $('.sharing-list__item').addClass('sharing-quote__normal').removeClass('sharing-quote__active');
                $el.addClass('sharing-quote__active').removeClass('sharing-quote__normal');
            });
        };
    };

    return ModalShareDirective;
});
