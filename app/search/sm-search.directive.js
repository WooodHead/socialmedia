/**
 * Fetches and displays server-side filtered items.
 * Listens on $scope for 'search' and reacts accordingly.
 *
 * @namespace Directives
 */
(function() {
  angular
    .module('SocialMedia')
    .directive('smSearch', smSearch);

  function smSearch($location) {
    return directive = {
      restrict: 'A',
      templateUrl: 'views/search/sm-search.directive.jade',
      controller: smSearchCtrl,
      controllerAs: 'vm',
      bindToController: true
    };

    function smSearchCtrl($scope, $location, itemsService) {
      var vm = this;

      search($location.search().text);

      $scope.$on('search', function(event, data) { search(data.text); });

      function search(text) {
        vm.loading = true;
        vm.results = itemsService.get({ query: { $text: { $search: text, }, }, },
          function(res) {
            vm.loading = false;
            $location.search({ text: text });
          }
        );
      }
    }
  }
})();
