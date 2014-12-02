/**
 * Core controller
 *
 * @class lorax/controllers/CoreCtrl
 * @param $scope
 */
define(function () {
    'use strict';

    /*jshint unused: false */
    var CoreCtrl = function (
        $scope,
        windowService,
        pubSubService,
        routesSerivce,
        dataService
    ) {
        this._$scope = $scope;
        this._windowService = windowService;
        this._pubSubService = pubSubService;
        this._dataService = dataService;

        $scope.core = {
            openEmailModal: this.openEmailModal.bind(this),
            openShareModal: this.openShareModal.bind(this),
            openShareOptions: this.openShareOptions.bind(this),
            closeShareOptions: this.closeShareOptions.bind(this),
            openAboutModal: this.openAboutModal.bind(this),
            openLegendModal: this.openLegendModal.bind(this),
            siteInfo: this.siteInfo.bind(this)
        };

        this._dataService.getMain().then(function (model) {
            this._$scope.core.miscData = model.getMiscLocale();
        }.bind(this));

        pubSubService.subscribe('windowService.breakpoint', this.onBreakpointChange.bind(this));
    };

    CoreCtrl.$inject = [
        '$scope',
        'windowService',
        'pubSubService',
        'routesService',
        'dataService'
    ];

    CoreCtrl.prototype.openEmailModal = function () {
        this._$scope.$broadcast('openEmailModal');
    };

    CoreCtrl.prototype.openShareModal = function (service) {
        this._$scope.$broadcast('openShareModal', service);
    };

    CoreCtrl.prototype.openShareOptions = function () {
        this._$scope.core.shareOptions = true;
    };

    CoreCtrl.prototype.closeShareOptions = function () {
        this._$scope.core.shareOptions = false;
    };

    CoreCtrl.prototype.openAboutModal = function () {
        this._$scope.$broadcast('openAboutModal');
    };

    CoreCtrl.prototype.openLegendModal = function () {
        this._$scope.$broadcast('openLegendModal');
    };

    CoreCtrl.prototype.siteInfo = function () {
        this._$scope.$broadcast('openMobileOptions', true);
    };

    CoreCtrl.prototype.onBreakpointChange = function (bp) {
        if (bp !== 'small') {
            this._$scope.$broadcast('openMobileOptions', false);
        }
    };

    return CoreCtrl;
});
