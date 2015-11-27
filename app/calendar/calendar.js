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
        element[0].innerHTML =
          '<a href="#/edit/' + event._id + '">' + event.content.message + '</a>';
      }
    }
  };
}]);
