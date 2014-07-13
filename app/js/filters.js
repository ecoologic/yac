'use strict';
var filters = {};

filters.markdown = function($sce) {
  var converter = new Showdown.converter();
  return function(text) {
    return $sce.trustAsHtml(converter.makeHtml(text || ''));
  };
};

filters.iconize = function($sce) {
  return function(text) {
    return $sce.trustAsHtml(
      text.toString().replace(/\W:(\w+):\W/im, function(match, $1) {
        return ''.concat(
          match[0],
          '<span class="fontelico-emo-', $1, '" data-text="emo-', $1, '"/>',
          match[match.length -1]
        );
      })
    );
  };
};

filters.cleanTime = function() {
  return function(timestamp) {
    return timestamp.replace(new Date().toLocaleDateString(), '');
  };
};

filters.debug = function() {
  return function(args) {
    debugger;
    return args;
  };
};
