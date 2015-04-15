/**
 * @fileOverview Email Modal directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['angular', 'jquery', 'jquery-customselect'], function (angular, $) {
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
            onFormSubmit: this.onFormSubmit.bind(this),
            showSubmitBtn: false,
            showFailedBtn: false,
            showSuccessBtn: false
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


        $('.enter-email__country select').customSelect({
            customClass: 'enter-email__country-dropdown'
        });
    };

    ModalEmailController.prototype.closeModal = function () {
        this._$scope.modalEmail.open = false;

        this._windowService.setModalOpen(false);
    };

    ModalEmailController.prototype.onInputChange = function () {
        this._$scope.modalEmail.showSubmitBtn =
         (this._$scope.modalEmail.terms && this._$scope.modalEmail.email) ? true : false;
    };

    ModalEmailController.prototype.onFormSubmit = function () {
        var url = 'https://basket.mozilla.org/news/subscribe/';
        var newsletters = 'shape-web';
        var source_url = 'https://shapeoftheweb.mozilla.org';
        source_url = encodeURIComponent(source_url);
        // store a reference to the controller
        var controller = this;
        var email = controller._$scope.modalEmail.email;
        var country = controller._$scope.modalEmail.country;
        if (country === undefined) {
            country = 'USA';
        }
        var lang = 'en'
        var fmt = 'H';
        var privacy = 'on';
        var params = 'newsletters=' + newsletters + '&source_url=' + source_url + '&email=' + email +
            '&country=' + country + '&lang=' + lang + '&fmt=' + fmt + '&privacy=' + privacy;
        var request_url = url + '?' + params;
        controller._$scope.modalEmail.showSubmitBtn = false;


        $.post(url, { newsletters: newsletters, source_url : source_url, email : email, country : country, lang : lang, fmt : fmt, privacy : privacy}, function(response) {
            controller._$scope.modalEmail.showSuccessBtn = true;
            controller._$scope.modalEmail.showSubmitBtn = false;
            ga('send','pageview','/email/submit/');
            controller._$scope.$apply();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            controller._$scope.modalEmail.showFailedBtn = true;
            controller._$scope.modalEmail.showSubmitBtn = true;
            controller._$scope.$apply();
        });
    };

    return ModalEmailDirective;
});
