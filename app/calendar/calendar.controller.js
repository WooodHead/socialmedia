(function() {
  angular
    .module('SocialMedia')
    .controller('CalendarCtrl', CalendarCtrl);
})();

function CalendarCtrl($scope, $routeParams, $location, Items, socket, uiCalendarConfig) {
  $scope.uiConfig = { calendar: {
    defaultDate: new Date($routeParams.year, $routeParams.month, $routeParams.day),
    defaultView: 'basicWeek',
    firstDay: 1,
    header: {
      left: 'month basicWeek',
      center: 'title',
      right: ' today prev,next'
    },
    eventRender: function(event, element, view) {
      console.log(element);
      element[0].id = event._id;

      return element;
  }}};

  // We will cache the items retrieved via http
  // and then keep them up-to-date via socket.io
  $scope.cachedItems = [];
  $scope.cachedWeek = -1;
  $scope.cachedMonth = -1;
  $scope.previousView = '';

  $scope.eventSources = [{
    // Create the required fields for fullCalendar, as well as some optional ones
    eventDataTransform: function(item) {
      item.id = item._id;
      if(item.content && item.content.message)
        item.title = item.content.message;
      item.url = '#/edit/' + item._id;
      item.start = new Date(item.scheduled);
      return item;
    },
    events: function(start, end, timezone, callback) {
      var view = uiCalendarConfig.calendars['itemsCalendar'].fullCalendar('getView').type;
      $location.path('/calendar/' + start.year() + '/' + start.month() + '/' + start.date(), false);

      console.log(view, start.month(), $scope.cachedMonth, start.isoWeek(), $scope.cachedWeek);

      // We already received the new item via the socket
      if(view === $scope.previousView &&
          (view === 'month' && start.month() === $scope.cachedMonth ||
          view === 'basicWeek' && start.isoWeek() === $scope.cachedWeek)) {
            console.log('cached', $scope.cachedWeek, $scope.cachedMonth);
            return callback($scope.cachedItems);
      } else {
        // Remove month listeners
        socket.removeAllListeners('items:month:' + $scope.cachedMonth + ':new');
        socket.removeAllListeners('items:month:' + $scope.cachedMonth + ':edit');
        socket.removeAllListeners('items:month:' + $scope.cachedMonth + ':delete');

        // Remove week listeners
        socket.removeAllListeners('items:week:' + $scope.cachedWeek + ':new');
        socket.removeAllListeners('items:week:' + $scope.cachedWeek + ':edit');
        socket.removeAllListeners('items:week:' + $scope.cachedWeek + ':delete');

        // Clear caches
        $scope.cachedItems = [];
        $scope.previousView = '';
        $scope.cachedMonth = $scope.cachedWeek = -1;
      }

      // Mongoose query for fetching items scheduled for this time period
      var query = { scheduled: {
        $gte: start.format('YYYY-MM-DD'),
        $lte: end.format('YYYY-MM-DD')
      }};

      // Fetch and cache the items
      Items.get({ query: query }, function(res) {
        $scope.cachedItems = res;
        $scope.previousView = view;

        if(view === 'month') $scope.cachedMonth = start.month();
        else if(view === 'basicWeek') $scope.cachedWeek = start.isoWeek();

        callback($scope.cachedItems);
      }, function(err) {
        console.error(err);
      });

      switch (view) {
        case 'month':
          socket.on('items:month:' + start.month() + ':new', $scope.onNewItem);
          socket.on('items:month:' + start.month() + ':edit', $scope.onItemUpdate);
          socket.on('items:month:' + start.month() + ':delete', $scope.onItemDelete);
          break;
        case 'basicWeek':
          socket.on('items:week:' + start.isoWeek() + ':new', $scope.onNewItem);
          socket.on('items:week:' + start.isoWeek() + ':edit', $scope.onItemUpdate);
          socket.on('items:week:' + start.isoWeek() + ':delete', $scope.onItemDelete);
          break;
      }
    }
  }];

  $scope.onNewItem = function(item) {
    $scope.cachedItems.push(item);
    uiCalendarConfig.calendars['itemsCalendar'].fullCalendar('refetchEvents');
  };

  $scope.onItemUpdate = function(item) {
    console.log(item);
    var index = $scope.indexOfItem(item._id);

    if(index !== null) {
      $scope.cachedItems[index] = item;
      uiCalendarConfig.calendars['itemsCalendar'].fullCalendar('refetchEvents');
    } else {
      // TODO: Force refresh
      console.error('could not find item', index);
    }
  };

  $scope.onItemDelete = function(item) {
    console.log(item);
    var index = $scope.indexOfItem(item._id);
    if(index !== null) {
      $scope.cachedItems.splice(index, 1);
      uiCalendarConfig.calendars['itemsCalendar'].fullCalendar('refetchEvents');
    } else {
      // TODO: Force refresh
      console.error('could not find item', index);
    }
  };

  $scope.indexOfItem = function(id) {
    for (var i = 0; i < $scope.cachedItems.length; i++)
      if($scope.cachedItems[i]._id === id)
        return i;

    return null;
  };
};
