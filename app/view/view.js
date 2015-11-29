app.directive('view', function() {
  return {
    restrict: 'A',
    templateUrl: 'views/view',
    scope: {
      item: '='
    }
  };
});
