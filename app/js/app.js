'use strict';
var controllers = {}; /////////////////////////////////////////////////////////
controllers.MessagesCtrl = function($scope, Resource) {
  $scope.messages = Resource.messages;
};
controllers.NewMessageCtrl = function($scope, Resource, Authentication) {
  $scope.create = function() {
    $scope.newMessage.senderUserKey = Authentication.getCurrentUserKey();
    Resource.messages.$add($scope.newMessage);
    $scope.newMessage = {};
  };
};
controllers.AuthenticationCtrl = function($scope, Authentication, Resource) {
  $scope.create = function() {
    Authentication.login().then(function(user) {
      console.log('AuthenticationCtrl#create - login - then', user);
      $scope.currentUser = user;
      $scope.isLoggedIn = !!user;
    });
  };
};
var services = {}; ////////////////////////////////////////////////////////////
services.Authentication = function(Resource, $firebaseSimpleLogin, $q) {
  var currentUser, currentUserKey, errors;
  var auth = $firebaseSimpleLogin(Resource.firebaseRef);
  var afterLogin = function(user) {
    console.log('Authentication - afterLogin', user);
    errors         = errors;
    currentUser    = user;
    currentUserKey = user.username;

    if(!errors) {
      Resource.users[user.username] = user;
      Resource.users.$save(user.username);
    };

    return user;
  };
  return {
    login:             function() { return auth.$login('github').then(afterLogin); },
    getCurrentUser:    function() { return currentUser; },
    getCurrentUserKey: function() { return currentUserKey; }
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
                 // .config()
                 .controller(controllers)
                 .service(services)
                 .filter(filters)
                 .run(run);
