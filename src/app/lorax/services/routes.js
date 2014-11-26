define([], function () {
    'use strict';

    var RoutesService = function ($rootScope, $route, pubSubService) {
        this._$rootScope = $rootScope;
        this._pubSubService = pubSubService;

        // hijack route change
        this._$rootScope.$on('$routeChangeSuccess', function (event, newValue) {
            this._onRouteChange(newValue);
        }.bind(this));
    };

    RoutesService.prototype._onRouteChange = function (route) {
        this.page = route.page;
        this.params = route.params;
        this._pubSubService.publish('routesService.change', [this.page, this.params]);
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
        '$route',
        'pubSubService'
    ];

    return RoutesService;
});
