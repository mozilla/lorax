define([], function () {
    'use strict';

    var RoutesService = function ($rootScope, $location, $route, $timeout, pubSubService) {
        this._$rootScope = $rootScope;
        this._$location = $location;
        this._$route = $route;
        this._$timeout = $timeout;
        this._pubSubService = pubSubService;

        // hijack route change
        this._$rootScope.$on('$routeChangeSuccess', function (event, newValue) {
            this._onRouteChange(newValue);
        }.bind(this));

        this._pubSubService.subscribe('windowService.issue', this._onIssueChange.bind(this));
    };

    RoutesService.prototype._onRouteChange = function (route) {
        this.page = route.page;
        this.params = route.params;
        this._pubSubService.publish('routesService.change', [this.page, this.params]);
        var pg = '';
        if (this.page == 'experience') {
            if (!this.params.mode) {
                pg = '/';
            } else {
                pg = '/' + this.params.mode + '/';
            }
        } else if (this.page == 'detail') {
            if (!this.params.issue) {
                pg = '/detail/' + this.params.topic + '/';
            } else {
                pg = '/detail/' + this.params.topic + '/' + this.params.issue + '/';    
            }
        }

        ga('send', 'pageview', pg);
    };

    RoutesService.prototype._onIssueChange = function (data) {
        var topic = data.getParent().getId();
        var issue = data.getId();
        this._$timeout(function () {
            this._$location.url('/detail/' + topic + '/' + issue).replace();
        }.bind(this));
    };

    RoutesService.prototype.subscribe = function (eventType, callback) {
        this._pubSubService.subscribe('routesService.' + eventType, function (e, res) {
            callback(res);
        });
    }

    RoutesService.prototype.unsubscribe = function (eventType, callback) {
        this._pubSubService.unsubscribe('routesService.' + eventType, callback);
    }

    RoutesService.$inject = [
        '$rootScope',
        '$location',
        '$route',
        '$timeout',
        'pubSubService'
    ];

    return RoutesService;
});
