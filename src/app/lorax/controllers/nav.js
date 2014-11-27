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
        windowService
    ) {

        this._$scope = $scope;
        this._$timeout = $timeout;
        this._windowService = windowService;

        this._$scope.nav = {
            active : 'access'
        };

        this._$scope.nav.handleClick = function () {
        }.bind(this);

        windowService.subscribe('topic', this._onChangeTopic.bind(this));
    };

    NavCtrl.$inject = [
        '$scope',
        '$timeout',
        'windowService'
    ];

    NavCtrl.prototype._onChangeTopic = function (topic) {
        this._$timeout(function () {
            this._$scope.nav.active = topic;
        }.bind(this));
    };

    return NavCtrl;
});
