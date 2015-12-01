(function() {
  angular
    .module('SocialMedia.Calendar')
    .controller('CalendarCtrl', CalendarCtrl);

  function CalendarCtrl($routeParams, $location, itemsService, socket, uiCalendarConfig, ngDialog) {
    var vm = this;

    vm.networks = [{ name: 'Facebook' }, { name:'Twitter' }];
    vm.networks.forEach(function(network) { network.ticked = true; });
    vm.networkClick = function(network) {
      console.log(network);
      vm.filter.changed = true;
      uiCalendarConfig.calendars['itemsCalendar'].fullCalendar('refetchEvents');
    };

    // FullCalendar
    vm.uiConfig = uiConfig();
    vm.eventSources = eventSources();

    vm.filter = { networks: vm.networks };

    // We will cache the items retrieved via http
    // and then keep them up-to-date via socket.io
    var cachedItems = [];
    var cachedWeek = -1;
    var cachedMonth = -1;
    var previousView = '';

    function uiConfig() {
      var date = Object.keys($routeParams).length !== 0 ?
        new Date($routeParams.year, $routeParams.month, $routeParams.day) :
        new Date();

      return {
        calendar: {
          defaultDate: date,
          defaultView: 'basicWeek',
          firstDay: 1,
          header: {
            left: 'month basicWeek',
            center: 'title',
            right: ' today prev,next'
          },
          eventRender: function(event, element, view) {
            element[0].id = event._id;
            return element;
          },
          eventClick: function(event, jsEvent, view) {
            ngDialog.open({
              template:
                '<div smi-view item="item" style="display:flex;justify-content:center;align-items:center;"/>' +
                '<a href="#/edit/' + event._id + '" class="btn btn-primary btn-block">Edit</a>',
              controller: function($scope) { $scope.item = event; },
              plain: true,
              appendTo: '#dialog'
            });
          }
        }
      }
    }

    function eventSources() {
      return [{
        // Create the required fields for fullCalendar, as well as some optional ones
        eventDataTransform: function(item) {
          item.id = item._id;
          if(item.content && item.content.message)
            item.title = item.content.message;
          item.start = new Date(item.scheduled);
          return item;
        },
        events: function(start, end, timezone, callback) {
          console.log(start);
          var view = uiCalendarConfig.calendars['itemsCalendar'].fullCalendar('getView').type;
          $location.update_path(datePath(start), true);

          if(vm.filter.changed) {
            console.log('filter change');
          } else {
            // We already received the new item via the socket
            if(view === previousView &&
                (view === 'month' && start.month() === cachedMonth ||
                view === 'basicWeek' && start.isoWeek() === cachedWeek)) {
                  return callback(cachedItems);
            } else {
              // Remove month listeners
              socket.removeAllListeners('items:month:' + cachedMonth + ':new');
              socket.removeAllListeners('items:month:' + cachedMonth + ':edit');
              socket.removeAllListeners('items:month:' + cachedMonth + ':delete');

              // Remove week listeners
              socket.removeAllListeners('items:week:' + cachedWeek + ':new');
              socket.removeAllListeners('items:week:' + cachedWeek + ':edit');
              socket.removeAllListeners('items:week:' + cachedWeek + ':delete');

              // Clear caches
              cachedItems = [];
              previousView = '';
              cachedMonth = cachedWeek = -1;
            }
          }

          console.log('constructing query', JSON.stringify(vm.filter));

          // Mongoose query for fetching items scheduled for this time period
          var query = {
            scheduled: {
              $gte: start.format('YYYY-MM-DD'),
              $lte: end.format('YYYY-MM-DD')
            },
            'content.network': { $in: vm.filter.networks.map(x => x.name) }
          };

          vm.query = query;

          // Fetch and cache the items
          itemsService.get({ query: query }, function(res) {
            cachedItems = res;
            previousView = view;
            vm.filter.changed = false;

            if(view === 'month') cachedMonth = start.month();
            else if(view === 'basicWeek') cachedWeek = start.isoWeek();

            callback(cachedItems);
          }, function(err) {
            console.error(err);
          });

          switch (view) {
            case 'month':
              socket.on('items:month:' + start.month() + ':new', onNewItem);
              socket.on('items:month:' + start.month() + ':edit', onItemUpdate);
              socket.on('items:month:' + start.month() + ':delete', onItemDelete);
              break;
            case 'basicWeek':
              socket.on('items:week:' + start.isoWeek() + ':new', onNewItem);
              socket.on('items:week:' + start.isoWeek() + ':edit', onItemUpdate);
              socket.on('items:week:' + start.isoWeek() + ':delete', onItemDelete);
              break;
          }
        }
      }];
    };

    function filterItem(item) {
      for (var i = 0; i < vm.filter.networks.length; i++) {
        if(vm.filter.networks[i].name === item.content.network)
          return true;
      }

      return false;
    };

    function onNewItem(item) {
      if(!filterItem(item)) return;
      cachedItems.push(item);
      uiCalendarConfig.calendars['itemsCalendar'].fullCalendar('refetchEvents');
    };

    function onItemUpdate(item) {
      if(!filterItem(item)) return;
      var index = indexOfItem(item._id);

      if(index !== null) {
        cachedItems[index] = item;
        uiCalendarConfig.calendars['itemsCalendar'].fullCalendar('refetchEvents');
      } else {
        // TODO: Force refresh
        console.error('could not find item', index);
      }
    };

    function onItemDelete(item) {
      if(!filterItem(item)) return;
      var index = indexOfItem(item._id);
      if(index !== null) {
        cachedItems.splice(index, 1);
        uiCalendarConfig.calendars['itemsCalendar'].fullCalendar('refetchEvents');
      } else {
        // TODO: Force refresh
        console.error('could not find item', index);
      }
    };

    function indexOfItem(id) {
      for (var i = 0; i < cachedItems.length; i++)
        if(cachedItems[i]._id === id)
          return i;

      return null;
    }

    function datePath(date) {
      return '/calendar/' + date.year() + '/' + date.month() + '/' + date.date();
    }
  };
})();
