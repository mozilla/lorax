/**
 * @fileOverview Issue Modal directive
 */
define(['angular', 'jquery'], function (angular, $) {
    'use strict';

    /**
     * Issue Modal directive
     */
    var ModalIssueDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            controller: ModalIssueController,
            templateUrl: '/app/lorax/directives/modal-issue.tpl.html'
        };
    };

    /**
    * Controller for Issue Modal directive
    * @constructor
    */
    var ModalIssueController = function (
        $scope,
        $location,
        $timeout,
        windowService,
        dataService
    ) {

        this._$scope = $scope;
        this._$location = $location;
        this._$timeout = $timeout;
        this._windowService = windowService;
        this._dataService = dataService;

        $scope.modalIssue = {
            open: false,
            closeModal: this.closeModal.bind(this)
        };

        // listen for $broadcast of 'openIssueModal'
        $scope.$on('openIssueModal', this.openModal.bind(this));
    };

    /**
    * Array of dependencies to be injected into controller
    * @type {Array}
    */
    ModalIssueController.$inject = [
        '$scope',
        '$location',
        '$timeout',
        'windowService',
        'dataService'
    ];

    /**
     * Triggered by a modalIssue event broadcast from:
     * src/app/lorax/services/experience.js and recieves the issue to show.
     */
    ModalIssueController.prototype.openModal = function (e, issue) {

        this._dataService.getMain().then(function (model) {

            this._$scope.modalIssue.open = true;
            this._$scope.modalIssue.issue = model.getIssueById(issue);

            this._$scope.issue = model.getIssueById(issue);

            // causes _onIssueChange in /src/app/lorax/services/routes.js to
            // be called which then updates the url to the new topic and issue
            this._windowService.setIssue(this._$scope.modalIssue.issue);

            // the call to setBgMode in /src/app/lorax/services/window.js causes
            // it to publish a windowService.bgMode event, which is then handled
            // in /src/app/lorax/directives/window.js (onBgModeChange) which in turn
            // sets the background color of the issue modal based on the status of
            // the current issue.
            this._windowService.setBgMode(this._$scope.issue.getStatusDescription(), false);

            this._windowService.setIssueMode(true);
            this._windowService.setModalOpen(true);

        }.bind(this));
    };

    ModalIssueController.prototype.closeModal = function () {
        this._$scope.modalIssue.open = false;

        this._windowService.setIssueMode(false);
        this._windowService.setModalOpen(false);

        this._$timeout(function () {
            this._$location.url('/');
        }.bind(this));
    };

    return ModalIssueDirective;
});
