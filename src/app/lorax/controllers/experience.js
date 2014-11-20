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
        $location,
        experienceService
    ) {
        this._experienceService = experienceService;

        this._$scope = $scope;
        this._$scope.experience = {
            switchView: this.switchView.bind(this),
            currentView: 'explore'
        };

        if ($location.path() === '/intro') {
            this._experienceService.switchView('intro');
        } else {
            this._experienceService.switchView('explore');
        }
    };

    ExperienceCtrl.$inject = [
        '$scope',
        '$location',
        'experienceService'
    ];

    ExperienceCtrl.prototype.switchView = function (view) {
        this._$scope.experience.currentView = view;
        this._experienceService.switchView(view);
    };

    return ExperienceCtrl;
});
