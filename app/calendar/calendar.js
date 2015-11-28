app.controller('CalendarCtrl', ['$scope', 'Items', function($scope, Items) {
  $scope.eventSources = [{
    events: function(start, end, timezone, callback) {
      var query = { scheduled: {
        $gte: start.format('YYYY-MM-DD'),
        $lte: end.format('YYYY-MM-DD')
      }};

      Items.get({ query: query }, function(res) {
        res.forEach(function(item) { item.start = new Date(item.scheduled); });

        callback(res);
      }, function(err) {
        console.error(err);
      });
    }
  }];

  $scope.uiConfig = {
    calendar: {
      defaultView: 'basicWeek',
      eventRender: function(event, element) {
        var network = '<div>' + event.content.network + '</div>'
        var img = event.content.media ?
          ('<img src="' + event.content.media.url + '" style="width: 100%"/>') :
          '';
        var message = '<a href="#/edit/' + event._id + '" style="color: white">' + event.content.message + '</a>';

        element[0].innerHTML = network + img + message;
      }
    }
  };
}]);
