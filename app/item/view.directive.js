(function() {
  angular
    .module('SocialMedia')
    .directive('view', view);

  function view() {
    return {
      restrict: 'A',
      templateUrl: 'views/item/view.directive.jade',
      scope: {
        item: '='
      }
    };
  }
})();
