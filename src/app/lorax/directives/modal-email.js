/**
 * @fileOverview Email Modal directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['angular'], function (angular) {
    'use strict';

    /**
     * Share Modal directive
     */
    var ModalEmailDirective = function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            controller: ModalEmailController,
            templateUrl: '/app/lorax/directives/modal-email.tpl.html'
        };
    };

    /**
    * Controller for Share Modal directive
    * @constructor
    */
    var ModalEmailController = function (
        $scope,
        windowService
    ) {
        this._$scope = $scope;
        this._windowService = windowService;

        $scope.modalEmail = {
            open: false,
            closeModal: this.closeModal.bind(this)
        };

        // listen for $broadcast of 'openEmailModal'
        $scope.$on('openEmailModal', this.openModal.bind(this));
    };

    /**
    * Array of dependencies to be injected into controller
    * @type {Array}
    */
    ModalEmailController.$inject = [
        '$scope',
        'windowService'
    ];

    ModalEmailController.prototype.openModal = function () {
        angular.extend(
            this._$scope.modalEmail,
            {
                open: true
            }
        );

        this._windowService.setModalOpen(true);
    };

    ModalEmailController.prototype.closeModal = function () {
        this._$scope.modalShare.open = false;

        this._windowService.setModalOpen(false);
    };

    return ModalEmailDirective;
});
