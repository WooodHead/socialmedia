app.factory('ItemsFactory', ['$resource', function($resource) {
  return $resource('/api/items', [], {
    get: { method: 'GET', isArray: true }
  });
}]);

app.factory('ItemsSocket', function(socketFactory) { return socketFactory(); });

app.directive('items', ['ItemsFactory', 'ItemsSocket', function(ItemsFactory, ItemsSocket) {
  return {
    restrict: 'E',
    templateUrl: 'views/items',
    controller: function() {

    },
    link: function(scope, element, attrs) {
      scope.ids = ItemsFactory.get({});

      ItemsSocket.on('items:put', function(ids) { scope.ids = ids; });
      ItemsSocket.on('items:post', function(id) { scope.ids.push(id); });
      ItemsSocket.on('items:delete:all', function() { scope.ids = []; });

      ItemsSocket.on('items:delete', function(id) {
        scope.ids.splice(scope.ids.indexOf(id), 1);
      });
    }
  };
}]);
