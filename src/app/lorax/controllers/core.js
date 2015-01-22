/**
 * Core controller
 *
 * @class lorax/controllers/CoreCtrl
 * @param $scope
 */
define(['webfontloader'], function (WebFont) {
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
            siteInfo: this.siteInfo.bind(this),
            isLoaded: false
        };

        this.init();
    };

    CoreCtrl.$inject = [
        '$scope',
        'windowService',
        'pubSubService',
        'routesService',
        'dataService'
    ];

    CoreCtrl.prototype.init = function () {
        WebFont.load({
            active: this.loadMain.bind(this),
            custom: {families: ['Fira Sans:n2,n3,n4,n5,n6,n7,n8,n9']}
        });
    };

    CoreCtrl.prototype.loadMain = function () {
        this._dataService.getMain().then(function (model) {
            this._$scope.core.miscData = model.getMiscLocale();
            this.onLoaded();
        }.bind(this));
    };

    CoreCtrl.prototype.onLoaded = function () {
        document.title = this._$scope.core.miscData.siteTitle;
        this._$scope.core.isLoaded = true;
        this._pubSubService.publish('window.onLoaded');
        this._pubSubService.subscribe('windowService.breakpoint', this.onBreakpointChange.bind(this));
    };

    CoreCtrl.prototype.openEmailModal = function () {
        this._$scope.$broadcast('openEmailModal');
        ga('send','pageview','/email/');
    };

    CoreCtrl.prototype.openShareModal = function (service) {
        this._$scope.$broadcast('openShareModal', service);
        ga('send','pageview','/share/');
    };

    CoreCtrl.prototype.openShareOptions = function () {
        this._$scope.core.shareOptions = true;
    };

    CoreCtrl.prototype.closeShareOptions = function () {
        this._$scope.core.shareOptions = false;
    };

    CoreCtrl.prototype.openAboutModal = function () {
        this._$scope.$broadcast('openAboutModal');
        ga('send','pageview','/about/');
    };

    CoreCtrl.prototype.openLegendModal = function () {
        this._$scope.$broadcast('openLegendModal');
        ga('send','pageview','/legend/');
    };

    CoreCtrl.prototype.siteInfo = function () {
        this._$scope.$broadcast('openMobileOptions', true);
        ga('send','pageview','/mobileOptions/');
    };

    CoreCtrl.prototype.onBreakpointChange = function (bp) {
        if (bp !== 'small') {
            this._$scope.$broadcast('openMobileOptions', false);
        }
    };

    return CoreCtrl;
});
