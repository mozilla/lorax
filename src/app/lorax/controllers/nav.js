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
    $location,
    dataService
  ) {

    this._$scope = $scope;
    this._$location = $location;

    this._$scope.nav = {
      active : "availability"
    }

    this._$scope.nav.handleClick = function(topic) {
      this._$scope.nav.active = topic;
    }.bind(this);

    dataService.getMain().then(function(model) {
      this._$scope.nav.model = model;


    }.bind(this));

    //console.log(this._$location.search('topic'));

  };

  NavCtrl.$inject = [
    '$scope',
    '$location',
    'dataService'
  ];

  return NavCtrl;
});
