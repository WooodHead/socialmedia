app.directive('scheduler', function() {
  return {
    templateUrl: 'views/scheduler',
    scope: {
      date: '='
    }
  };
});
