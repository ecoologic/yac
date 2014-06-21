'use strict';
var directives = {}; //////////////////////////////////////////////////////////
directives.authentication = function(Authentication) {
  return {
    restrict:    'E',
    scope:       '@',
    templateUrl: 'partials/authentication.html',
    link: function(scope) {
      scope.currentUser = Authentication.getCurrentUser();

      scope.login = function() {
        Authentication.login().then(function(user) {
          console.log('Authentication#login', user);
          scope.currentUser = user;
        });
      };
      scope.logout = function() {
        Authentication.logout();
        scope.currentUser = null;
      };
    }
  };
};
var controllers = {}; /////////////////////////////////////////////////////////
controllers.MessagesCtrl = function($scope, Resource) {
  $scope.users    = Resource.users;
  $scope.messages = Resource.messages;
};
controllers.NewMessageCtrl = function($scope, Resource, Authentication) {
  $scope.create = function() {
    $scope.newMessage.senderUserKey = Authentication.getCurrentUserKey();
    $scope.newMessage.createdAt = (new Date()).toLocaleString();
    Resource.messages.$add($scope.newMessage);
    $scope.newMessage = {};
  };
};
var services = {}; ////////////////////////////////////////////////////////////
services.Authentication = function(Resource, $cookieStore, $firebaseSimpleLogin) {
  var currentUser, currentUserKey;
  var session = $cookieStore.get('session');
  if(session && session['currentUserKey']) {
    currentUserKey = session['currentUserKey'];
    currentUser    = Resource.users.$child(currentUserKey);
  };
  console.log('Authentication - ', currentUserKey);

  var auth = $firebaseSimpleLogin(Resource.ref(''));
  var afterLogin = function(user) {
    console.log('Authentication - afterLogin', user);
    currentUser    = user;
    currentUserKey = user.username;

    $cookieStore.put('session', { currentUserKey: currentUserKey });
    Resource.users[user.username] = user;
    Resource.users.$save(user.username);

    return user;
  };
  var logout = function() {
    console.log('Authentication - logout');
    $cookieStore.remove('session');
    currentUser    = null;
    currentUserKey = null;
  };

  return {
    login:             function() { return auth.$login('github').then(afterLogin); },
    logout:            logout,
    getCurrentUser:    function() { return currentUser; },
    getCurrentUserKey: function() { return currentUserKey; }
  };
};
services.Resource = function($firebase) {
  var firebaseUrl = 'https://yetanotherchat.firebaseio.com/development/';
  return {
    ref:         function(path) { return new Firebase(firebaseUrl + path) },
    messages:    $firebase(new Firebase(firebaseUrl + 'messages')),
    users:       $firebase(new Firebase(firebaseUrl + 'users')),
  };
};
var filters = {}; /////////////////////////////////////////////////////////////
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
var run = function($rootScope, $log) { ////////////////////////////////////////
  $rootScope.$log = $log;
};
var dependencies = [ //////////////////////////////////////////////////////////
  'firebase',        // https://www.firebase.com/docs/angular/reference.html
                     // https://www.firebase.com/docs/queries.html
                     // https://www.firebase.com/docs/data-structure.html
  'ngCookies'
];
var app = angular.module('app', dependencies) /////////////////////////////////
                 .controller(controllers)
                 .directive(directives)
                 .service(services)
                 .filter(filters)
                 .run(run);
