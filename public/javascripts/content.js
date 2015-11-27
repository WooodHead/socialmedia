app.directive('content', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/content',
    scope: {
      content: '=',
      networks: '='
    }
  };
});
