app.factory('ItemFactory', ['$resource', function($resource) {
  return $resource('/api/items/:id');
}]);

app.directive('item', ['ItemFactory', function(ItemFactory) {
  return {
    restrict: 'E',
    templateUrl: 'views/item',
    controller: function($element, $attrs) {
    },
    link: function(scope, element, attrs) {
      scope.ids = attrs.ids;
      scope.item = ItemFactory.get({ id: attrs.id });
    }
  };
}]);
