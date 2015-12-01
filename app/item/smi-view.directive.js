(function() {
  angular
    .module('SocialMedia')
    .directive('smiView', smiView);

  function smiView() {
    return {
      restrict: 'A',
      templateUrl: 'views/item/smi-view.directive.jade',
      scope: {
        item: '=',
        edit: '=',
      },
    };
  }
})();
