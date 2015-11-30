(function() {
  angular.module('SocialMedia').directive('view', function() {
    return {
      restrict: 'A',
      templateUrl: 'views/item/view.directive.jade',
      scope: {
        item: '='
      }
    };
  });
})();
