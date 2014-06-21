'use strict';
var directives = {}; //////////////////////////////////////////////////////////
directives.authentication = function(Authentication) {
  return {
    restrict:    'E',
    scope:       '@',
    templateUrl: 'partials/authentication.html',
    link: function(scope) {
      scope.currentUser = Authentication.getCurrentUser();

      scope.create = function() {
        Authentication.login().then(function(user) {
          console.log('AuthenticationCtrl#create - login - then', user);
          scope.currentUser = user;
        });
      };
    }
  };
};
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
var services = {}; ////////////////////////////////////////////////////////////
services.Authentication = function(Resource, $cookieStore, $firebaseSimpleLogin) {
  var currentUser, currentUserKey;
  var session = $cookieStore.get('session');
  if(session && session['currentUserKey']) {
    currentUserKey = session['currentUserKey'];
    currentUser    = Resource.users.$child(currentUserKey);
  };
  console.log('Authentication - ', currentUserKey);

  var auth = $firebaseSimpleLogin(Resource.firebaseRef);
  var afterLogin = function(user) {
    console.log('Authentication - afterLogin', user);
    currentUser    = user;
    currentUserKey = user.username;

    $cookieStore.put('session', { currentUserKey: currentUserKey });
    Resource.users[user.username] = user;
    Resource.users.$save(user.username);

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
filters.markdown = function($sce) {
  var converter = new Showdown.converter();
  return function(text) {
    return $sce.trustAsHtml(converter.makeHtml(text || ''));
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
                 .directive(directives)
                 .service(services)
                 .filter(filters)
                 .run(run);
