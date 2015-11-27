var app = angular.module(
  'FalconSocial', [
    'ngResource',
    'ngRoute',
    // 'btford.socket-io',
    // 'ngTagsInput',
    // 'angularjs-dropdown-multiselect',
    // 'lr.upload',
    'ui.calendar'
  ]
);

app.config(['$routeProvider', '$httpProvider',
  function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/publish/', { templateUrl: 'views/publish' })
      .when('/edit/:id', { templateUrl: 'views/publish' })
      .when('/calendar', { templateUrl: 'views/calendar' });
}]);

app.factory('Items', ['$resource', function($resource) {
  return $resource('/api/v1/items', [], {
    get: { method: 'GET', isArray: true }
  });
}]);

app.factory('Item', ['$resource', function($resource) {
  return $resource('/api/v1/items/:id', [], {
    update: { method: 'PUT' }
  });
}]);
