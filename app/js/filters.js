'use strict';
var filters = {};

filters.markdown = function($sce) {
  var converter = new Showdown.converter();
  return function(text) {
    return $sce.trustAsHtml(converter.makeHtml(text || ''));
  };
};

filters.iconize = function($sce) {
  var insertIcon = function(match, $1) {
    return String.concat(
      match[0],
      '<span class="fontelico-emo-', $1, '" data-text="emo-', $1, '"/>',
      match[match.length -1]
    )
  };
  return function(text) {
    return $sce.trustAsHtml(
      text.toString().replace(/\W:(\w+):\W/im, insertIcon)
    )
  };
};

filters.cleanTime = function() {
  return function(timestamp) {
    return timestamp.replace((new Date()).toLocaleDateString(), '');
  };
};
