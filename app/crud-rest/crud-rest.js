app.controller('CrudRestCtrl', function($scope, Items, Item) {
  $scope.items = Items.get({});

  $scope.create = function() {
    console.log($scope.item);
    Items.save({}, $scope.item, function(res) {
      console.log(res);
    }, function(err) {
      console.error(err);
    });
  };

  $scope.update = function(item, data) {
    Item.update({ id: item._id }, { name: data });
  };

  $scope.delete = function(item) {
    Item.delete({ id: item._id }, function(res) {
      console.log(res);
    }, function(err) {
      console.error(err);
    });
  };
});
