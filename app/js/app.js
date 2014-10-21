'use strict';

var run = function($rootScope, $log) { ////////////////////////////////////////
  $rootScope.$log = $log;
};

var dependencies = [ //////////////////////////////////////////////////////////
  'firebase',        // https://www.firebase.com/docs/angular/reference.html
                     // https://www.firebase.com/docs/queries.html
                     // https://www.firebase.com/docs/data-structure.html
  'ngCookies',
  'angularFileUpload'
];

var app = angular.module('app', dependencies) /////////////////////////////////
                 .factory(factories)
                 .controller(controllers)
                 .filter(filters)
                 .service(services)
                 .run(run);
