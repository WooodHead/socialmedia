app.controller('PublishCtrl', ['$scope', '$routeParams', 'Items', 'Item',
  function($scope, $routeParams, Items, Item) {
    $scope.item = { content: { } };

    if($routeParams.id) {
      $scope.edit = true;
      $scope.item = Item.get({ id: $routeParams.id }, function(res) {
        $scope.item.scheduled = new Date($scope.item.scheduled);
      }, function(err) {
        console.error(err);
      });
    }

    $scope.publish = function() {
      Items.save($scope.item, function(res) {
        console.log(res);
      }, function(err) {
        console.error(err);
      });
    };

    $scope.update = function() {
      Item.update({ id: $routeParams.id }, $scope.item, function(res) {

      }, function(err) {
        console.error(err);
      });
    };
  }
]);
