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

    function smSearchCtrl($rootScope, $scope, $location, itemsService) {
      var vm = this;

      search($location.search().text);

      $scope.$on('search', function(event, data) { search(data.text); });

      function search(text) {
        vm.results = itemsService.get({ query: { $text: { $search: text, }, }, },
          function(res) {
            $location.search({ text: text });
          }
        );
      }
    }
  }
})();
