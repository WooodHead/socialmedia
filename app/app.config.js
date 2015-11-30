app.config(['$routeProvider', '$httpProvider',
  function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/publish/', { templateUrl: 'views/publish' })
      .when('/edit/:id', { templateUrl: 'views/publish' })
      .when('/calendar/:year/:month/:day', { templateUrl: 'views/calendar' })
      .when('/channels', createCrudRest('Channels', 'Channel'))
      .when('/countries', createCrudRest('Countries', 'Country'))
      .when('/regions', createCrudRest('Regions', 'Region'))
      .when('/cities', createCrudRest('Cities', 'City'))
      .when('/languages', createCrudRest('Languages', 'Language'));
}]);

function createCrudRest(items, item) {
  return {
    templateUrl: 'views/crud-rest',
    controller: 'CrudRestCtrl',
    resolve: {
      Items: items,
      Item: item
    }
  };
}
