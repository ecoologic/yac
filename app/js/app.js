'use strict';
var controllers = {}; /////////////////////////////////////////////////////////
controllers.MessagesCtrl = function($scope, Resource) {
  var initialize = function () {
    $scope.messages = Resource.messages;
  };
  initialize();
  debugger;
};
var services = {}; ////////////////////////////////////////////////////////////
services.Resource = function ($firebase) {
  var firebaseUrl = 'https://yac.firebaseio.com/development/';
  return {
    messages: $firebase(new Firebase(firebaseUrl + 'messages'))
  };
};
var filters = {}; /////////////////////////////////////////////////////////////
var run = function ($rootScope, $log) {
  $rootScope.$log = $log;
};
var dependencies = [ //////////////////////////////////////////////////////////
  'firebase'         // https://www.firebase.com/docs/angular/reference.html
                     // https://www.firebase.com/docs/queries.html
                     // https://www.firebase.com/docs/data-structure.html
];
var app = angular.module('app', dependencies) /////////////////////////////////
                 .controller(controllers)
                 .service(services)
                 .filter(filters)
                 .run(run);
