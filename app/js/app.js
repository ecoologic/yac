'use strict';
var controllers = {}; /////////////////////////////////////////////////////////
controllers.MessagesCtrl = function($scope, Resource) {
  $scope.messages = Resource.messages;
};
controllers.NewMessageCtrl = function($scope, Resource, Authentication) {
  var resetNewMessage = function() {
    $scope.newMessage = {
      text: '',
      senderName: Authentication.getCurrentUser().name
    };
  };
  resetNewMessage();

  $scope.create = function() {
    Resource.messages.$add($scope.newMessage);
    resetNewMessage();
  };
};
var services = {}; ////////////////////////////////////////////////////////////
services.Resource = function($firebase) {
  var firebaseUrl = 'https://yetanotherchat.firebaseio.com/development/';
  return {
    messages: $firebase(new Firebase(firebaseUrl + 'messages'))
  };
};
services.Authentication = function() {
  return {
    getCurrentUser: function() { return { name: 'erik' }; }
  };
};
var filters = {}; /////////////////////////////////////////////////////////////
var run = function($rootScope, $log) {
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
