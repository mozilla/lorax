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
    dataService
  ) {

    this._$scope = $scope;

    this._$scope.nav = {
      active : "availability",
      activeIssue : "available"
    }

    this._$scope.nav.handleClick = function(topic) {
      this._$scope.nav.active = topic;

      this._$scope.nav.activeIssue = this._$scope.nav.model.getTopicById(topic).getIssues()[0].getId();

    }.bind(this);

    dataService.getMain().then(function(model) {
      this._$scope.nav.model = model;
    }.bind(this));

  };

  NavCtrl.$inject = [
    '$scope',
    'dataService'
  ];

  return NavCtrl;
});
