'use strict';
var controllers = {};

controllers.AuthenticationCtrl = function($scope, Authentication, GithubAvatar) {
  var addAvatarUrl = function(key) {
    GithubAvatar({ userKey: key, size: 14 }).url(function(url) {
      $scope.avatarUrl = url;
    });
  };

  $scope.$watch('currentUserKey', addAvatarUrl);

  $scope.login  = Authentication.login;
  $scope.logout = Authentication.logout;
};

controllers.RoomsCtrl = function($scope, Resource, CurrentRoom) {
  var sort = function (response) {
    $scope.roomKeys = response.$getIndex(); //.sort(); // TODO: Smarter sort
  };

  $scope.currentRoom = CurrentRoom;

  $scope.rooms = Resource.rooms;
  $scope.$watchCollection('rooms', sort); // TODO: can it now be avoided?
};

controllers.MessagesCtrl = function($scope, Resource, AFH, GithubAvatar) {
  var addNewSenderAvatarUrls = function(newMessages) {
    AFH({ items: newMessages }).forEveryNewCollectionItem(function(message) {
      GithubAvatar({ userKey: message.senderKey }).url(function(url) {
        message.senderAvatarUrl = url;
      });
    });
  };

  $scope.$watchCollection('messages', addNewSenderAvatarUrls);
  $scope.messages = Resource.messages($scope.roomKey);

  $scope.deleteable = function(senderKey) {
    return senderKey === $scope.currentUserKey;
  };

  $scope.delete = function(key) {
    Resource.messages(roomKey).$remove(key);
  };
};

controllers.NewMessageCtrl = function($scope, NewMessageParser) {
  $scope.parse = function() {
    NewMessageParser.call($scope.newMessage);
    $scope.newMessage = {};
  };
};
