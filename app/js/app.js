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
controllers.AuthenticationCtrl = function($scope, Authentication, Resource) {
  $scope.create = function() {
    Authentication.login().then(function(user) {
      console.log('AuthenticationCtrl#create - login - then', user);
      var currentUser = { username: user.username };
      Resource.users[user.username] = currentUser;
      Resource.users.$save(user.username);
      $scope.currentUser = currentUser;
      $scope.isLoggedIn = !!$scope.currentUser;
    });
  };
};
var services = {}; ////////////////////////////////////////////////////////////
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
    messages:    $firebase(new Firebase(firebaseUrl + 'messages')),
    users:       $firebase(new Firebase(firebaseUrl + 'users')),
  };
};
var filters = {}; /////////////////////////////////////////////////////////////
var run = function($rootScope, $log) {
  $rootScope.$log = $log;
};
var dependencies = [ //////////////////////////////////////////////////////////
  'firebase'        // https://www.firebase.com/docs/angular/reference.html
                     // https://www.firebase.com/docs/queries.html
                     // https://www.firebase.com/docs/data-structure.html
  // 'ui.router'        // https://github.com/angular-ui/ui-router
];
// var config = function($stateProvider, $urlRouterProvider) { ///////////////////
//   $stateProvider
//     .state('authentication', {
//       url:         '/authentication',
//       templateUrl: 'partials/authentication/new.html'
//     });
// };
var app = angular.module('app', dependencies) /////////////////////////////////
                 // .config(config)
                 .controller(controllers)
                 .service(services)
                 .filter(filters)
                 .run(run);
