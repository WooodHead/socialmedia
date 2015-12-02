/**
 * Directive for displaying a calendar of item together with some filters
 *
 * @namespace Directives
 */
(function() {
  angular
    .module('SocialMedia.Calendar')
    .directive('smCalendar', smCalendar);

  function smCalendar() {
    return {
      templateUrl: 'views/calendar/sm-calendar.directive.jade',
      controllerAs: 'calendar',
      controller: CalendarCtrl,
    };
  }

  function CalendarCtrl($scope, $rootScope, $compile, $log, syncer, $routeParams,
    channelsService, $location, itemsService, uiCalendarConfig, ngDialog) {
    var vm = this;
    var cachedItems = [];
    var cachedWeek = -1;
    var cachedMonth = -1;
    var previousView = '';

    // ngDialog adds classes and attributes to the body, which will mess with
    // the layout of the page if not removed
    $scope.$on('$destroy', function destroy() { ngDialog.closeAll(); });

    // HACK: Manually tick the networks...
    vm.networks = [{ name: 'Facebook' }, { name: 'Twitter' }];
    vm.networks.forEach(function tickNetworks(network) { network.ticked = true; });

    // Fetch the channels
    channelsService.get().$promise.then(function channelsFulfilled(channels) {
      vm.channels = channels;
      // HACK: Manually tick the channels...
      vm.channels.forEach(function tickChannels(channel) { channel.ticked = true; });
    })

    /**
     * Forces the calendar to refetch its events
     */
    function refresh() {
      uiCalendarConfig.calendars.itemsCalendar.fullCalendar('refetchEvents');
    }

    // FullCalendar
    vm.uiConfig = uiConfig();
    vm.eventSources = eventSources();
    vm.refresh = refresh;

    vm.filter = { networks: vm.networks };

    // Configure appearance of the calendar
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
            right: ' today prev,next',
          },
          eventRender: function eventRender(event, element, view) {
            // If only custom render the event in the week view,
            // otherwise it is too big too display
            // IDEA: Maybe a custom directive for month?
            if(view.intervalUnit === 'week') {
              element[0].innerHTML = '';

              // The directive needs to be compiled, since we are manually
              // injecting HTML into the page
              var html = '<ng-include src="\'views/calendar/event-week\'"/>';
              var scope = $scope.$new(true);
              scope.item = event;
              scope.channels = event.channels.map(function(channel) { return channel.name }).join(', ');
              var template = angular.element(html);
              var linkFn = $compile(template);
              element.append(linkFn(scope));
            }

            return element;
          },
          eventClick: function eventClick(event) {
            // Open popup dialog
            ngDialog.open({
              templateUrl: 'views/calendar/event-dialog',
              controller: function eventClickController($scope) { $scope.item = event; },
              disableAnimation: true,
              appendTo: '#dialog',
            });
          },
        },
      };
    }

    function eventSources() {
      return [{
        // Create the required fields for fullCalendar, as well as some optional ones
        eventDataTransform: function evetnDataTransform(item) {
          item.scheduled = new Date(item.scheduled);
          item.id = item._id;
          item.start = new Date(item.scheduled);
          item.title = item.content.message;
          return item;
        },
        // Called every time the calendar needs to refetch its events
        events: function events(start, end, timezone, callback) {
          // Get the view type
          var view = uiCalendarConfig.calendars.itemsCalendar.fullCalendar('getView').type;

          // Update the URL to point to the current date
          $location.update_path(datePath(start), true);

          if (isSameView(start, view, previousView)) {
            return callback(syncer.filter());
          }

          // Fetch and cache the items
          itemsService.get({
            populate: 'channels',
            query: {
              scheduled: {
                $gte: start.format('YYYY-MM-DD'),
                $lte: end.format('YYYY-MM-DD'),
              },
            },
          }, function itemsServiceResolved(res) {
            syncer.removeSubscriptions(cachedWeek, cachedMonth);
            previousView = '';
            cachedMonth = cachedWeek = -1;

            cachedItems = res;
            previousView = view;

            // Reinitialize the syncer
            syncer.initialize(cachedItems, vm.filter, refresh);

            if (view === 'month') syncer.subscribeMonth(start.month());
            if (view === 'basicWeek') syncer.subscribeWeek(start.isoWeek());

            if (view === 'month') cachedMonth = start.month();
            else if (view === 'basicWeek') cachedWeek = start.isoWeek();

            callback(syncer.filter());
          }, function itemsServiceError(err) {
            $log.error(err);
          });
        },
      }];
    }

    function isSameView(start, view, previousView) {
      return (view === previousView &&
          (view === 'month' && start.month() === cachedMonth ||
          view === 'basicWeek' && start.isoWeek() === cachedWeek));
    }

    function datePath(date) {
      return '/calendar/' + date.year() + '/' + date.month() + '/' + date.date();
    }
  }
})();
