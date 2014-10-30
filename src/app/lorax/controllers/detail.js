/**
 * Detail page controller
 *
 * @class lorax/controllers/DetailCtrl
 * @param $scope
 */
define([], function () {
  'use strict';

  var DetailCtrl = function (
    $scope,
    $route,
    dataService
  ) {

    this._$scope = $scope;
    this._$route = $route;

    this._$scope.detail = { };

    dataService.getMain().then(function(model) {
      this._$scope.detail.model = model;
    }.bind(this));

    this._$scope.$on('$routeChangeSuccess', function(evt, newParam) {
      this._$scope.detail.topicParam = newParam.params.topic;
      this._$scope.detail.issueParam = newParam.params.issue;

      if ( newParam.params.issue ) {
        console.log("Issue exists. Animate!");
      } else if ( newParam.params.topic ) {
        //console.log(this._$scope.detail.model.getTopicById(newParam.params.topic).getIssues()[0]);
      } else {
        console.log("Nothing. Go to top of page.");
      }
    }.bind(this));


  };

  DetailCtrl.$inject = [
    '$scope',
    '$route',
    'dataService'
  ];

  return DetailCtrl;
});
