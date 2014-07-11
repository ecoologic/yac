'use strict';
var controllers = {};

controllers.AuthenticationCtrl = function($scope, Authentication, User) {
  $scope.$watch('currentUserKey', function(key) {
    User({ key: key }).avatarUrl(function(snapshot) {
      $scope.avatarUrl = snapshot.val();
    });
  });

  $scope.login  = Authentication.login;
  $scope.logout = Authentication.logout;
};

controllers.RoomsCtrl = function($scope, Resource) {
  $scope.rooms = Resource.rooms;
};

controllers.MessagesCtrl = function($scope, Resource, Message) {
  $scope.$watchCollection('messages', function(newMessages, oldMessages) {
    if(!newMessages) return;
    _.each(newMessages.$getIndex(), function(messageKey) {
      var message = newMessages[messageKey];
      if(message.senderAvatarUrl) return;
      Message({ message: message }).senderAvatarUrl(function(snapshot) {
        message.senderAvatarUrl = snapshot.val() || 'img/missing_avatar.png?';
      });
    });
  });

  $scope.messages = Resource.messages($scope.roomKey);

  $scope.isCurrentUserMessage = function(userKey) {
    return $scope.currentUserKey === userKey;
  };

  $scope.deleteable = function(senderKey) {
    return senderKey === $scope.currentUserKey;
  };

  $scope.delete = function(key) {
    Resource.messages(roomKey).$remove(key);
  };
};

controllers.NewMessageCtrl = function($scope, Authentication, Resource) {
  $scope.activeRoomKey = 'hall';
  $scope.create = function() {
    $scope.newMessage.senderKey = $scope.currentUserKey;
    $scope.newMessage.createdAt = new Date().toLocaleString();
    Resource.messages($scope.activeRoomKey).$add($scope.newMessage);
    $scope.newMessage = {};
  };
};
