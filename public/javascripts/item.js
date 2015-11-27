app.factory('ItemFactory', ['$resource', function($resource) {
  return $resource('/api/items/:id', [], {
    update: { method: 'PUT' }
  });
}]);

app.directive('item', ['ItemFactory', 'ItemsSocket',  function(ItemFactory, ItemsSocket) {
  return {
    restrict: 'E',
    templateUrl: 'views/item',
    controller: function($element, $attrs) {
    },
    link: function(scope, element, attrs) {
      // TODO: Move in a more appropiate place
      scope.networks = ['Facebook', 'Twitter', 'Google+'];
      scope.postTypes = ['Engage', 'Advertise', 'Promotion'];

      scope.item = ItemFactory.get({ id: attrs.id }, function(res) {
        // It is a string by default
        scope.item.scheduled = new Date(scope.item.scheduled);
      });

      ItemsSocket.on('items:' + attrs.id + ':put', function(item) {
        scope.item = item;
      });

      scope.save = function() {
        ItemFactory.put({ id: scope.item.id }, scope.item, function(res) {
          console.log(res);
        }, function(res) {
          console.error(res);
        });
      };

      scope.delete = function() {
        ItemFactory.delete({ id: scope.item.id }, {}, function(res) {
          console.log(res);
        }, function(res) {
          console.error(res);
        });
      };
    }
  };
}]);
