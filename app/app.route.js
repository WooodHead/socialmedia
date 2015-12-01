(function() {
  angular
    .module('SocialMedia')
    .config(routes);

  function routes($routeProvider) {
    $routeProvider
      .when('/publish/', { template: '<div sm-publish/>' })
      .when('/view/:id', { template: '<div sm-publish/>' })
      .when('/edit/:id', { template: '<div sm-publish/>' })
      .when('/calendar/:year?/:month?/:day?', { template: '<div sm-calendar/>', })
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
