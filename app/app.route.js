/**
 * Setup application routes
 *
 * @namespace Routes
 */
(function() {
  angular
    .module('SocialMedia')
    .config(routes);

  function routes($routeProvider) {
    $routeProvider
      .when('/publish/', { template: '<div sm-publish/>' })
      .when('/view/:id', { template: '<div sm-publish/>' })
      .when('/edit/:id', { template: '<div sm-publish/>', })
      .when('/calendar/:year?/:month?/:day?', { template: '<div sm-calendar/>', })
      .when('/search', { template: '<div sm-search/>', reloadOnSearch: false, })
      .otherwise({ redirectTo: '/calendar' });
  }
})();
