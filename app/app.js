var app = angular.module(
  'FalconSocial', [
    'ngResource',
    'ngRoute',
    // 'btford.socket-io',
    // 'angularjs-dropdown-multiselect',
    'ui.calendar',
    'ngFileUpload',
    'ngTagsInput',
    'checklist-model'
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
    update: { method: 'PATCH' }
  });
}]);
