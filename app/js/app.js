'use strict';
var controllers = {}; /////////////////////////////////////////////////////////
controllers.MessagesCtrl = function($scope, Resource) {
  $scope.messages = Resource.messages;
};
controllers.NewMessageCtrl = function($scope, Resource, Authentication) {
  var resetNewMessage = function() {
    $scope.newMessage = {
      text:       '',
      senderName: 'erik' // Authentication.getCurrentUser().username
    };
  };
  resetNewMessage();

  $scope.create = function() {
    Resource.messages.$add($scope.newMessage);
    resetNewMessage();
  };
};
controllers.SessionCtrl = function($scope, Authentication) {
  $scope.create = function() {
    Authentication.login().then(function(user) {
      console.log('SessionCtrl#create - login - then', user);
      $scope.currentUser = user;
      $scope.isLoggedIn = !!$scope.currentUser;
    });
  };
};
var services = {}; ////////////////////////////////////////////////////////////
// https://www.firebase.com/docs/security/simple-login-facebook.html
services.Authentication = function(Resource, $firebaseSimpleLogin) {
  var currentUser, errors;
  var auth = $firebaseSimpleLogin(Resource.firebaseRef, function(errors, user) {
    console.log('Authentication - $firebaseSimpleLogin', errors, user);
    errors      = errors;
    currentUser = user;
  });
  return {
    login:          function() { return auth.$login('github'); },
    getCurrentUser: function() { return currentUser; }
  };
};
services.Resource = function($firebase) {
  var firebaseUrl = 'https://yetanotherchat.firebaseio.com/development/';
  return {
    firebaseRef: new Firebase(firebaseUrl),
    messages:    $firebase(new Firebase(firebaseUrl + 'messages'))
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
