(function() {
  angular
    .module('SocialMedia')
    .config(['$routeProvider', '$httpProvider', routes]);

  function routes($routeProvider, $httpProvider) {
    $routeProvider
      .when('/publish/', {
        templateUrl: 'views/publish',
        controller: 'PublishCtrl',
        controllerAs: 'publish',
        resolve: {
          Channels: channelsFetcher,
          Geo: geoFetcher,
        }
      })
      .when('/edit/:id', {
        templateUrl: 'views/publish',
        controller: 'PublishCtrl',
        controllerAs: 'publish',
        resolve: {
          Item: itemFetcher,
          Channels: channelsFetcher,
          Geo: geoFetcher,
        }
      })
      .when('/calendar/:year/:month/:day', { templateUrl: 'views/calendar' })
      .when('/channels', createCrudRest('Channels', 'Channel'))
      .when('/countries', createCrudRest('Countries', 'Country'))
      .when('/regions', createCrudRest('Regions', 'Region'))
      .when('/cities', createCrudRest('Cities', 'City'))
      .when('/languages', createCrudRest('Languages', 'Language'));
  }

  function createCrudRest(items, item) {
    return {
      templateUrl: 'views/crud-rest',
      controller: 'CrudRestCtrl',
      controllerAs: 'crudRest',
      resolve: {
        Items: items,
        Item: item
      }
    };
  }

  function itemFetcher(Item, $route) { console.log($route); return Item.get({ id: $route.current.params.id }); }
  function channelsFetcher(Channels) { return Channels.get(); }
  function geoFetcher(Countries, Regions, Cities, Languages) {
    return {
      countries: Countries.get({}),
      regions: Regions.get({}),
      cities: Cities.get({}),
      languages: Languages.get({}),
    };
  }
})();
