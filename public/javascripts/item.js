app.factory('ItemFactory', ['$resource', function($resource) {
  return $resource('/api/items/:id');
}]);

app.directive('item', ['ItemFactory', 'ItemsSocket',  function(ItemFactory, ItemsSocket) {
  return {
    restrict: 'E',
    templateUrl: 'views/item',
    controller: function($element, $attrs) {
    },
    link: function(scope, element, attrs) {
      scope.item = ItemFactory.get({ id: attrs.id }, function(res) {
        // It is a string by default
        scope.item.scheduled = new Date(scope.item.scheduled);
      });

      ItemsSocket.on('items:' + attrs.id + ':put', function(item) {
        scope.item = item;
      });
    }
  };
}]);
