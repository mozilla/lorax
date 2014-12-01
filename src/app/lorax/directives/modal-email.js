/**
 * @fileOverview Email Modal directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['angular', 'jquery', 'jquery-selectric'], function (angular, $) {
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
        windowService,
        dataService
    ) {
        this._$scope = $scope;
        this._windowService = windowService;
        this._dataService = dataService;

        $scope.modalEmail = {
            open: false,
            closeModal: this.closeModal.bind(this),
            email: null,
            terms: null,
            onInputChange: this.onInputChange.bind(this),
            showSubmitBtn: false
        };

        // listen for $broadcast of 'openEmailModal'
        $scope.$on('openEmailModal', this.openModal.bind(this));

        this._dataService.getMain().then(function (model) {
            this._$scope.modalEmail.content = model.getModals().email;
        }.bind(this));

        this._dataService.getMap().then(function (model) {
            this._$scope.modalEmail.countries = model.countryData;
        }.bind(this));
    };

    /**
    * Array of dependencies to be injected into controller
    * @type {Array}
    */
    ModalEmailController.$inject = [
        '$scope',
        'windowService',
        'dataService'
    ];

    ModalEmailController.prototype.openModal = function () {
        angular.extend(
            this._$scope.modalEmail,
            {
                open: true
            }
        );

        this._windowService.setModalOpen(true);
        $('.enter-email__country select').selectric('init', {
            disableOnMobile: false
        });
    };

    ModalEmailController.prototype.closeModal = function () {
        this._$scope.modalEmail.open = false;

        this._windowService.setModalOpen(false);
    };

    ModalEmailController.prototype.onInputChange = function () {
        // this._$scope.modalEmail.showSubmitBtn =
        //  (this._$scope.modalEmail.email) ? true : false;

        this._$scope.modalEmail.showSubmitBtn =
         (this._$scope.modalEmail.terms && this._$scope.modalEmail.email) ? true : false;
    };

    return ModalEmailDirective;
});
