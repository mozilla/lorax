/**
 * Nav bar controller
 *
 * @class lorax/controllers/DetailCtrl
 * @param $scope
 */
define([], function () {
    'use strict';

    var NavCtrl = function (
        $scope,
        $timeout,
        windowService,
        dataService
    ) {

        this._$scope = $scope;
        this._$timeout = $timeout;
        this._windowService = windowService;
        this._dataService = dataService;

        this._$scope.nav = {
            active : null
        };

        this._dataService.getMain().then(function (model) {
            this._$scope.nav.content = model.getMiscLocale();
        }.bind(this));

        windowService.subscribe('topic', this._onChangeTopic.bind(this));
    };

    NavCtrl.$inject = [
        '$scope',
        '$timeout',
        'windowService',
        'dataService'
    ];

    NavCtrl.prototype._onChangeTopic = function (topic) {
        this._$timeout(function () {
            this._$scope.nav.active = topic;
        }.bind(this));
    };

    return NavCtrl;
});
