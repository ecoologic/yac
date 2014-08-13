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
    $scope.roomKeys = response.$getIndex().sort();
  };

  $scope.currentRoom = CurrentRoom;

  $scope.rooms = Resource.rooms;
  $scope.$watchCollection('rooms', sort);
};

controllers.MessagesCtrl = function($scope, Resource, H, GithubAvatar) {
  var addNewSenderAvatarUrls = function(newMessages) {
    H({ items: newMessages }).forEveryNewCollectionItem(function(message) {
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

controllers.NewMessageCtrl = function($scope, Authentication, Resource, CurrentRoom) {
  // eg text: `/newroom let's move the conversation here`
  var setCurrentRoom = function() {
    $scope.newMessage.text = $scope.newMessage.text.replace(/^\/(\w+)\W?/, function(match, $1) {
      CurrentRoom.key = $1;
      return '';
    });
  };

  var create = function() {
    if(!$scope.newMessage.text.trim()) return;
    $scope.newMessage.senderKey = $scope.currentUserKey;
    $scope.newMessage.createdAt = new Date().toLocaleString();
    Resource.room(CurrentRoom.key).$set({ lastMessageAt: $scope.newMessage.createdAt });
    Resource.messages(CurrentRoom.key).$add($scope.newMessage);
    $scope.newMessage = {};
  };

  $scope.parse = function() {
    setCurrentRoom();
    create();
  };
};
