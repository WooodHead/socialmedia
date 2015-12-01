(function() {
  angular
    .module('SocialMedia.Calendar')
    .controller('CalendarCtrl', CalendarCtrl);

  function CalendarCtrl($scope, provider, $routeParams, $location, itemsService, channels, socket, uiCalendarConfig, ngDialog) {
    var vm = this;

    $scope.$on('$destroy', function() { ngDialog.closeAll(); })

    vm.networks = [{ name: 'Facebook' }, { name:'Twitter' }];
    vm.networks.forEach(function(network) { network.ticked = true; });
    vm.channels = channels;
    vm.channels.forEach(function(channel) { channel.ticked = true; });

    function refresh() {
      uiCalendarConfig.calendars['itemsCalendar'].fullCalendar('refetchEvents');
    }

    // FullCalendar
    vm.uiConfig = uiConfig();
    vm.eventSources = eventSources();
    vm.refresh = refresh;

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
            if(view.intervalUnit === 'week')
              element[0].innerHTML =
                '<span style="margin-right: 6px">' + event.scheduled.getHours() + ':' + event.scheduled.getMinutes() + '</span>' +
                '<span>' + event.channels.map(x => x.name).join(', ') + '</span>' +
                '<img style="width: 100%" src="' + event.content.media.fileUrl + '"/>' +
                '<span>' + event.content.message + '</span>';
            return element;
          },
          eventClick: function(event, jsEvent, view) {
            ngDialog.open({
              template:
                '<div smi-view item="item" edit="true" style="display:flex;justify-content:center;align-items:center;"/>',
              controller: function($scope) { $scope.item = event; },
              plain: true,
              disableAnimation: true,
              appendTo: '#dialog'
            });
          },
        }
      }
    }

    function eventSources() {
      return [{
        // Create the required fields for fullCalendar, as well as some optional ones
        eventDataTransform: function(item) {
          item.scheduled = new Date(item.scheduled);
          item.id = item._id;
          item.start = new Date(item.scheduled);
          item.title = item.content.message
          return item;
        },
        events: function(start, end, timezone, callback) {
          // Get the view type
          var view = uiCalendarConfig.calendars['itemsCalendar'].fullCalendar('getView').type;

          // Update the URL
          $location.update_path(datePath(start), true);

          console.log('AAA');

          if(view === previousView &&
              (view === 'month' && start.month() === cachedMonth ||
              view === 'basicWeek' && start.isoWeek() === cachedWeek)) {
            return callback(provider.filter());
          }

          // Mongoose query for fetching items scheduled for this time period
          var query = {
            scheduled: {
              $gte: start.format('YYYY-MM-DD'),
              $lte: end.format('YYYY-MM-DD')
            },
          };

          // Fetch and cache the items
          itemsService.get({ populate: 'channels'}, function(res) {
            provider.removeSubscriptions(cachedWeek, cachedMonth);
            previousView = '';
            cachedMonth = cachedWeek = -1;

            cachedItems = res;
            previousView = view;

            provider.initialize(cachedItems, vm.filter, refresh);

            if(view === 'month') provider.subscribeMonth(start.month())
            if(view === 'basicWeek') provider.subscribeWeek(start.isoWeek());

            if(view === 'month') cachedMonth = start.month();
            else if(view === 'basicWeek') cachedWeek = start.isoWeek();

            callback(provider.filter());
          }, function(err) {
            console.error(err);
          });
        }
      }];
    };

    function datePath(date) {
      return '/calendar/' + date.year() + '/' + date.month() + '/' + date.date();
    }
  };
})();
