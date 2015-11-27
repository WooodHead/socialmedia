app.controller('CalendarCtrl', ['$scope', '$location', 'ItemsFactory', 'ItemFactory', 'Storage', function($scope, $location, ItemsFactory, ItemFactory, Storage) {
  // $scope.events = [];

  $scope.eventSources = [{
    events: function(start, end, timezone, callback) {
      var query = { scheduled: {
        $gte: start.format('YYYY-MM-DD'),
        $lte: end.format('YYYY-MM-DD')
      }};

      ItemsFactory.get({ query: query }, function(res) {
        res.forEach(function(item) {
          item.start = new Date(item.scheduled);
          item.text = item.content.message;
        });
        Storage.items = res;
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
        // console.log(event);
        element[0].innerHTML =
          '<a href="#/publish/' + event.id + '" style="color: white;">' +
            // (event.content.media && event.content.media.url) ?
            //   ('<img src="' + event.content.media.url + '" style="width: 100%" />') :
            //   ('')
            // +
            '<span>' + event.content.message + '</span>' +
          '</a>';
      }
    }
  };
}]);
