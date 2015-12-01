(function() {
  angular
    .module('SocialMedia')
    .config(['$routeProvider', routes]);

  function routes($routeProvider) {
    $routeProvider
      .when('/publish/', {
        templateUrl: 'views/publish',
        controller: 'PublishCtrl',
        controllerAs: 'publish',
      })
      .when('/view/:id', {
        templateUrl: 'views/publish',
        controller: 'PublishCtrl',
        controllerAs: 'publish',
      })
      .when('/edit/:id', {
        templateUrl: 'views/publish',
        controller: 'PublishCtrl',
        controllerAs: 'publish',
      })
      .when('/calendar/:year?/:month?/:day?', {
        templateUrl: 'views/calendar',
        controller: 'CalendarCtrl',
        controllerAs: 'calendar',
        resolve: {
          channels: function channelsPromise(channelsService) { return channelsService.get().$promise; },
        },
      })
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
        objectService: sg,
      },
    };
  }
})();
