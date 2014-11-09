define([], function () {
    'use strict';

    return function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    };
});
