'use strict';

require.config({
  paths: {
    'jquery': '../libs/jquery',
    'd3': '../libs/d3'
  },

  shim: {
    'jquery': {
      exports: '$'
    }
  }
});

require(['main']);
