app.controller('ChannelsCtrl', ['$scope', 'Channels', 'Channel',
  function($scope, Channels, Channel) {
    $scope.channels = Channels.get({});

    $scope.create = function() {
      Channels.save({}, $scope.channel, function(res) {
        console.log(res);
      }, function(err) {
        console.error(err);
      });
    };

    $scope.update = function(channel, data) {
      Channel.update({ id: channel._id }, { name: data });
    };

    $scope.delete = function(channel) {
      Channel.delete({ id: channel._id }, function(res) {
        console.log(res);
      }, function(err) {
        console.error(err);
      });
    };
  }
]);
