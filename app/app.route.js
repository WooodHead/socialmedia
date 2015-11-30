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
          item: function() { return null; },
          channels: channelsFetcher,
          geo: geoFetcher,
        }
      })
      .when('/edit/:id', {
        templateUrl: 'views/publish',
        controller: 'PublishCtrl',
        controllerAs: 'publish',
        resolve: {
          item: itemFetcher,
          channels: channelsFetcher,
          geo: geoFetcher,
        }
      })
      .when('/calendar/:year?/:month?/:day?', { templateUrl: 'views/calendar' })
      .when('/channels', createCrudRest('channelsService', 'channelService'))
      .when('/countries', createCrudRest('countriesService', 'countryService'))
      .when('/regions', createCrudRest('regionsService', 'regionService'))
      .when('/cities', createCrudRest('citiesService', 'cityService'))
      .when('/languages', createCrudRest('languagesService', 'languageService'));
  }

  function createCrudRest(pl, sg) {
    return {
      templateUrl: 'views/crud-rest',
      controller: 'CrudRestCtrl',
      controllerAs: 'crudRest',
      resolve: {
        objectsService: pl,
        objectService: sg
      }
    };
  }

  function itemFetcher(itemService, $route) { return itemService.get({ id: $route.current.params.id }); }
  function channelsFetcher(channelsService) { return channelsService.get(); }
  function geoFetcher(countriesService, regionsService, citiesService, languagesService) {
    return {
      countries: countriesService.get({}),
      regions: regionsService.get({}),
      cities: citiesService.get({}),
      languages: languagesService.get({}),
    };
  }
})();
