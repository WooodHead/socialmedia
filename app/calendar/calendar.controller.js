(function() {
  angular
    .module('SocialMedia')
    .controller('CalendarCtrl', CalendarCtrl);
})();

function CalendarCtrl($routeParams, $location, Items, socket, uiCalendarConfig) {
  var vm = this;

  vm.uiConfig = { calendar: {
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
  vm.cachedItems = [];
  vm.cachedWeek = -1;
  vm.cachedMonth = -1;
  vm.previousView = '';

  vm.eventSources = [{
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

      console.log(view, start.month(), vm.cachedMonth, start.isoWeek(), vm.cachedWeek);

      // We already received the new item via the socket
      if(view === vm.previousView &&
          (view === 'month' && start.month() === vm.cachedMonth ||
          view === 'basicWeek' && start.isoWeek() === vm.cachedWeek)) {
            console.log('cached', vm.cachedWeek, vm.cachedMonth);
            return callback(vm.cachedItems);
      } else {
        // Remove month listeners
        socket.removeAllListeners('items:month:' + vm.cachedMonth + ':new');
        socket.removeAllListeners('items:month:' + vm.cachedMonth + ':edit');
        socket.removeAllListeners('items:month:' + vm.cachedMonth + ':delete');

        // Remove week listeners
        socket.removeAllListeners('items:week:' + vm.cachedWeek + ':new');
        socket.removeAllListeners('items:week:' + vm.cachedWeek + ':edit');
        socket.removeAllListeners('items:week:' + vm.cachedWeek + ':delete');

        // Clear caches
        vm.cachedItems = [];
        vm.previousView = '';
        vm.cachedMonth = vm.cachedWeek = -1;
      }

      // Mongoose query for fetching items scheduled for this time period
      var query = { scheduled: {
        $gte: start.format('YYYY-MM-DD'),
        $lte: end.format('YYYY-MM-DD')
      }};

      // Fetch and cache the items
      Items.get({ query: query }, function(res) {
        vm.cachedItems = res;
        vm.previousView = view;

        if(view === 'month') vm.cachedMonth = start.month();
        else if(view === 'basicWeek') vm.cachedWeek = start.isoWeek();

        callback(vm.cachedItems);
      }, function(err) {
        console.error(err);
      });

      switch (view) {
        case 'month':
          socket.on('items:month:' + start.month() + ':new', vm.onNewItem);
          socket.on('items:month:' + start.month() + ':edit', vm.onItemUpdate);
          socket.on('items:month:' + start.month() + ':delete', vm.onItemDelete);
          break;
        case 'basicWeek':
          socket.on('items:week:' + start.isoWeek() + ':new', vm.onNewItem);
          socket.on('items:week:' + start.isoWeek() + ':edit', vm.onItemUpdate);
          socket.on('items:week:' + start.isoWeek() + ':delete', vm.onItemDelete);
          break;
      }
    }
  }];

  vm.onNewItem = function(item) {
    vm.cachedItems.push(item);
    uiCalendarConfig.calendars['itemsCalendar'].fullCalendar('refetchEvents');
  };

  vm.onItemUpdate = function(item) {
    console.log(item);
    var index = vm.indexOfItem(item._id);

    if(index !== null) {
      vm.cachedItems[index] = item;
      uiCalendarConfig.calendars['itemsCalendar'].fullCalendar('refetchEvents');
    } else {
      // TODO: Force refresh
      console.error('could not find item', index);
    }
  };

  vm.onItemDelete = function(item) {
    console.log(item);
    var index = vm.indexOfItem(item._id);
    if(index !== null) {
      vm.cachedItems.splice(index, 1);
      uiCalendarConfig.calendars['itemsCalendar'].fullCalendar('refetchEvents');
    } else {
      // TODO: Force refresh
      console.error('could not find item', index);
    }
  };

  vm.indexOfItem = function(id) {
    for (var i = 0; i < vm.cachedItems.length; i++)
      if(vm.cachedItems[i]._id === id)
        return i;

    return null;
  };
};
