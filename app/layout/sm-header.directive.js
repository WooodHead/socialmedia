/**
 * Provides navigation links and search functionality
 * Search is $location sensitive, as it either changes path to /search
 * or broadcast the search text if the path is already /search.
 *
 * @namespace Directives
 */
(function() {
  angular
    .module('SocialMedia')
    .directive('smHeader', smHeader);

  function smHeader() {
    return directive = {
      restrict: 'A',
      templateUrl: 'views/layout/sm-header.directive.jade',
      controller: smHeaderCtrl,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  function smHeaderCtrl($rootScope, $location) {
    var vm = this;

    vm.search = search;

    function search() {
      if($location.path() === '/search') {
        $rootScope.$broadcast('search', { text: vm.text });
      } else {
        $location.path('/search').search({ text: vm.text });
      }
    }
  }
})();
