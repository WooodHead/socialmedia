(function() {
  angular
    .module('SocialMedia')
    .directive('smView', smView);

  function smView() {
    return {
      restrict: 'A',
      templateUrl: 'views/item/sm-view.directive.jade',
      scope: {
        item: '=',
        edit: '=',
        next: '=',
      },
    };
  }
})();
