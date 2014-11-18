define(function () {
    'use strict';

    var EncodeUriFilter = function ($window) {
        return $window.encodeURIComponent;
    };

    return EncodeUriFilter;
});
