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
        $scope
    ) {
        this._$scope = $scope;

        $scope.core = {
            openEmailModal: this.openEmailModal.bind(this),
            openShareModal: this.openShareModal.bind(this),
            openShareOptions: this.openShareOptions.bind(this),
            closeShareOptions: this.closeShareOptions.bind(this)
        };
    };

    CoreCtrl.$inject = [
        '$scope'
    ];

    CoreCtrl.prototype.openEmailModal = function () {
        this._$scope.$broadcast('openEmailModal');
    };

    CoreCtrl.prototype.openShareModal = function (service) {
        this._$scope.$broadcast('openShareModal', service);
        console.log('go');
    };

    CoreCtrl.prototype.openShareOptions = function () {
        this._$scope.core.shareOptions = true;
    };

    CoreCtrl.prototype.closeShareOptions = function () {
        this._$scope.core.shareOptions = false;
    };

    return CoreCtrl;
});
