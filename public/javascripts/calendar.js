app.controller('CalendarCtrl', ['$scope', '$location', 'ItemsFactory', 'ItemFactory', 'Storage', function($scope, $location, ItemsFactory, ItemFactory, Storage) {
  // $scope.events = [];

  $scope.eventSources = [{
    events: function(start, end, timezone, callback) {
      ItemsFactory.get({ start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD') }, function(res) {
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
        element[0].innerHTML =
          '<a href="#/publish/' + event.id + '" style="color: white;">' +
            '<img src="' + event.content.media.url + '" style="width: 100%" />' +
            '<span>' + event.content.message + '</span>' +
          '</a>';
      }
    }
  };
}]);
