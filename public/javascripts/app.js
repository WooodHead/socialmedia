var app = angular.module(
  'FalconSocial', [
    'ngResource',
    'ngRoute',
    'btford.socket-io',
    'ngTagsInput',
    'angularjs-dropdown-multiselect',
     'lr.upload'
  ]
);

app.config(['$routeProvider', '$httpProvider',
  function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/publish', { templateUrl: 'views/publish' });
}]);
