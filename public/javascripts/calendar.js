app.controller('CalendarCtrl', ['$scope', 'ItemsFactory', 'ItemFactory', function($scope, ItemsFactory, ItemFactory) {
  // $scope.events = [];

  $scope.eventSources = [{
    events: []
  }];

  $scope.uiConfig = {
    calendar: {
      defaultView: 'basicWeek',
      eventRender: function(event, element) {
        element[0].innerHTML =
          '<a href="#/edit' + event.id + '" style="color: white;">' +
            '<img src="' + event.content.media.url + '" style="width: 100%" />' +
            '<span>' + event.content.message + '</span>' +
          '</a>';
      }
    }
  };

  var ids = ItemsFactory.get({}, function(res) {
    ids.forEach(function(id) {
      ItemFactory.get({ id: id }, function(res) {
        // console.log(res);
        if(res.scheduled) {
          res.start = new Date(res.scheduled);
          res.text = res.content.message;
          $scope.eventSources[0].events.push(res);
        }
      }, function(err) {
        console.error(err);
      });
    });
  }, function(err) {
    console.error(err);
  });
  //
  // $scope.eventSources = function(start, end, timezone, callback) {
  //   // ItemsFactory.get({}, function(res) {
  //     // console.log(res);
  //     console.log(JSON.stringify($scope.events));
  //     if(callback && typeof(callback) === 'function')
  //       callback($scope.events);
  //   // }, function(err) {
  //   //   console.error(err);
  //   //   callback([]);
  //   // });
  // };
}]);
