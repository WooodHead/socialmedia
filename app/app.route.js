(function() {
  angular
    .module('SocialMedia')
    .config(['$routeProvider', '$httpProvider', routes]);

  function routes($routeProvider, $httpProvider) {
    $routeProvider
      .when('/publish/', publish())
      .when('/edit/:id', publish())
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

  function publish() {
    return {
      templateUrl: 'views/publish',
      controller: 'PublishCtrl',
      controllerAs: 'publish',
      resolve: {
        item: function(itemService, $route) {
          if($route.current.params.id)
            return itemService.get({ id: $route.current.params.id }).$promise;
          else
            return null;
        },
        channels: function(channelsService) { return channelsService.get().$promise; },
        geo: function($q, countriesService, regionsService, citiesService, languagesService) {
          var geo = {
            countries: countriesService.get(),
            regions: regionsService.get(),
            cities: citiesService.get(),
            languages: languagesService.get(),
          };

          return $q.all(geo).then(function(values) { return values; });
        },
      }
    };
  }
})();
