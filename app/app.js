var app = angular.module(
  'FalconSocial', [
    'ngResource',
    'ngRoute',
    'btford.socket-io',
    'ui.calendar',
    'ngFileUpload',
    'ngTagsInput',
    'xeditable',
    'isteven-multi-select'
  ]
);

app.factory('socket', function (socketFactory) {
  return socketFactory();
});

createRestifyResource(app, 'v1', 'Item', 'Items');
createRestifyResource(app, 'v1', 'Channel', 'Channels');
createRestifyResource(app, 'v1', 'Country', 'Countries');
createRestifyResource(app, 'v1', 'Region', 'Regions');
createRestifyResource(app, 'v1', 'City', 'Cities');
createRestifyResource(app, 'v1', 'Language', 'Languages');

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

app.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}]);

function createRestifyResource(app, version, singular, plural) {
  app.factory(plural, ['$resource', function($resource) {
    return $resource('/api/' + version + '/' + plural.toLowerCase() + '?populate=channels', [], {
      get: { method: 'GET', isArray: true }
    });
  }]);

  app.factory(singular, ['$resource', function($resource) {
    return $resource('/api/' + version + '/' + plural.toLowerCase() + '/:id', [], {
      update: { method: 'PATCH' }
    });
  }]);
}

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
