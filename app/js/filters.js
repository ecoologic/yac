'use strict';
var filters = {};

filters.markdown = function($sce) {
  var converter = new Showdown.converter();
  return function(text) {
    return $sce.trustAsHtml(converter.makeHtml(text || ''));
  };
};
filters.cleanTime = function() {
  return function(timestamp) {
    return timestamp.replace((new Date()).toLocaleDateString(), '');
  };
};
