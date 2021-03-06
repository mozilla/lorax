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
            openAboutModal: this.openAboutModal.bind(this),
            shareUrl: this.shareUrl.bind(this),
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

    CoreCtrl.prototype.openAboutModal = function () {
        this._$scope.$broadcast('openAboutModal');
        ga('send','pageview','/about/');
    };

    // triggered by clicks on the facebook and twiiter icons
    CoreCtrl.prototype.shareUrl = function (service) {
        this._$scope.$broadcast('share', service);
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
