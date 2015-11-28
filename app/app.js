var app = angular.module(
  'FalconSocial', [
    'ngResource',
    'ngRoute',
    // 'btford.socket-io',
    'ui.calendar',
    'ngFileUpload',
    'ngTagsInput',
    'checklist-model',
    'xeditable',
    'isteven-multi-select'
  ]
);

app.config(['$routeProvider', '$httpProvider',
  function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/publish/', { templateUrl: 'views/publish' })
      .when('/edit/:id', { templateUrl: 'views/publish' })
      .when('/calendar', { templateUrl: 'views/calendar' })
      .when('/channels', { templateUrl: 'views/channels' });
}]);

app.factory('Items', ['$resource', function($resource) {
  return $resource('/api/v1/items?populate=channels', [], {
    get: { method: 'GET', isArray: true }
  });
}]);

app.factory('Item', ['$resource', function($resource) {
  return $resource('/api/v1/items/:id', [], {
    update: { method: 'PATCH' }
  });
}]);

app.factory('Channels', ['$resource', function($resource) {
  return $resource('/api/v1/channels', [], {
    get: { method: 'GET', isArray: true }
  });
}]);

app.factory('Channel', ['$resource', function($resource) {
  return $resource('/api/v1/channels/:id?populate=channels', [], {
    update: { method: 'PATCH' }
  });
}]);
