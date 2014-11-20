/**
 * Experience controller
 *
 * @class lorax/controllers/ExperienceCtrl
 * @param $scope
 */
define(['experience/experience'], function (Experience) {
    'use strict';

    /*jshint unused: false */
    var ExperienceCtrl = function (
        $scope,
        $location,
        dataService,
        experienceService
    ) {

        this._$scope = $scope;
        this._$scope.experience = {
            switchView: this.switchView.bind(this),
            currentView: 'explore'
        };

        this._experienceService = experienceService;
        this._dataService = dataService;

        this._dataService.getMain().then(function(model) {
            var experience = new Experience();
            experience.setData(model);
            this._experienceService.setCanvas(experience);

            if ($location.path() === '/intro') {
                this._experienceService.switchView('intro');
            } else {
                this._experienceService.switchView('explore');
            }
        }.bind(this));
    };

    ExperienceCtrl.$inject = [
        '$scope',
        '$location',
        'dataService',
        'experienceService'
    ];

    ExperienceCtrl.prototype.switchView = function (view) {
        this._$scope.experience.currentView = view;
        this._experienceService.switchView(view);
    };

    return ExperienceCtrl;
});
