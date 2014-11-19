/**
 * Experience controller
 *
 * @class lorax/controllers/ExperienceCtrl
 * @param $scope
 */
define([], function () {
    'use strict';

    /*jshint unused: false */
    var ExperienceCtrl = function (
        $scope,
        experienceService
    ) {

        this._$scope = $scope;
        this._$scope.experience = {
            switchView: this.switchView.bind(this),
            currentView: 'explore'
        };

        this._experienceService = experienceService;
    };

    ExperienceCtrl.$inject = [
        '$scope',
        'experienceService'
    ];

    ExperienceCtrl.prototype.switchView = function (view) {
        this._$scope.experience.currentView = view;
        this._experienceService.switchView(view);
    };

    return ExperienceCtrl;
});
