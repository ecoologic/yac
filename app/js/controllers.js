'use strict';
var controllers = {};

controllers.AuthenticationCtrl = function($scope, Authentication, User, CurrentUser) {
  $scope.currentUserKey = CurrentUser.getKey();
  $scope.currentUser    = CurrentUser.getValue();
  User($scope.currentUserKey).avatarUrl(function(snapshot) {
    $scope.avatarUrl = snapshot.val();
  });

  $scope.login  = function() { Authentication.login(); };
  $scope.logout = function() { Authentication.logout(); };
};

controllers.MessagesCtrl = function($scope, Resource, User, CurrentUser) {
  var setMessageSenderUserAvatarUrl = function(messageKey) {
    var message = $scope.messages[messageKey];
    if(!message.senderUserAvatarUrl) {
      User(message.senderUserKey).avatarUrl(function(snapshot) {
        $scope.messages[messageKey].senderUserAvatarUrl = snapshot.val() || 'images/missing_avatar.png?';
      });
    }
  };
  $scope.$watchCollection('messages', function(newMessages, oldMessages) {
    if(newMessages) {
      _.each(newMessages.$getIndex(), function(messageKey) {
        setMessageSenderUserAvatarUrl(messageKey);
      });
    };
  });

  $scope.messages       = Resource.messages;
  $scope.currentUserKey = CurrentUser.getKey();
  $scope.currentUser    = CurrentUser.getValue();

  $scope.deleteable = function(senderUserKey) {
    return senderUserKey === $scope.currentUserKey;
  };

  $scope.delete = function(key) {
    Resource.messages.$remove(key);
  }
};

controllers.NewMessageCtrl = function($scope, Authentication, Resource, CurrentUser) {
  $scope.currentUser    = CurrentUser.getValue();
  $scope.currentUserKey = CurrentUser.getKey();

  $scope.create = function() {
    $scope.newMessage.senderUserKey = $scope.currentUserKey;
    $scope.newMessage.createdAt     = (new Date()).toLocaleString();
    Resource.messages.$add($scope.newMessage);
    $scope.newMessage = {};
  };
};
