var app = angular.module(
  'FalconSocial', [
    'ngResource',
    'ngRoute',
    'btford.socket-io',
    'ngTagsInput',
    'angularjs-dropdown-multiselect',
    'lr.upload',
    'ui.calendar'
  ]
);

app.config(['$routeProvider', '$httpProvider',
  function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/publish/:id?', { templateUrl: 'views/publish' })
      .when('/calendar', { templateUrl: 'views/calendar' });
}]);

app.factory('Storage', function() {
  return { };
});
