/**
 * @fileOverview Share Modal directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['angular'], function (angular) {
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
            templateUrl: '/app/lorax/directives/modal-share.tpl.html'
        };
    };

    /**
    * Controller for Share Modal directive
    * @constructor
    */
    var ModalShareController = function (
        $scope
    ) {
        this._$scope = $scope;

        $scope.modalShare = {
            open: false,
            service: null,
            closeModal: this.closeModal.bind(this),
            onShare: this.onShare.bind(this),
            shareUrl: 'http://test.com'
        };

        $scope.$on('openShareModal', this.openModal.bind(this));
    };

    /**
    * Array of dependencies to be injected into controller
    * @type {Array}
    */
    ModalShareController.$inject = [
        '$scope'
    ];

    ModalShareController.prototype.openModal = function (e, service) {
        console.log(e, service);
        angular.extend(
            this._$scope.modalShare,
            {
                open: true,
                service: service
            }
        );
        console.log(this._$scope.modalShare);
    };

    ModalShareController.prototype.closeModal = function () {
        this._$scope.modalShare.open = false;
    };

    ModalShareController.prototype.onShare = function () {

    };

    return ModalShareDirective;
});
