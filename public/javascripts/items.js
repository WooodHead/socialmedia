app.factory('ItemsFactory', ['$resource', function($resource) {
  return $resource('/api/items', [], {
    get: { method: 'GET', isArray: true }
  });
}]);

app.directive('items', ['ItemsFactory', function(ItemsFactory) {
  return {
    restrict: 'E',
    templateUrl: 'views/items',
    controller: function() {

    },
    link: function(scope, element, attrs) {
      scope.ids = ItemsFactory.get({});
    }
  };
}]);
