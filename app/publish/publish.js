app.controller('PublishCtrl', ['$scope', '$routeParams', 'Items', 'Item', 'Upload',
  function($scope, $routeParams, Items, Item, Upload) {
    $scope.item = { content: { media: { } }, channels: [] };
    $scope.today = new Date();
    $scope.networks = ['Facebook', 'Twitter', 'Google+'];
    $scope.channels = [
      { name: 'Starbucks', id: 1 },
      { name: 'Carlsberg', id: 2 },
      { name: 'Motorola', id: 3 }
    ];
    $scope.regions = [
      { name: 'Europe', key: 1 },
      { name: 'Asia', key: 2 }
    ];
    $scope.countries = [
      { name: 'Denmark', key: 1 },
      { name: 'Germany', key: 2 }
    ];
    $scope.cities = [
      { name: 'Copenhagen', key: 1 },
      { name: 'Vienna', key: 2 }
    ];
    $scope.languages = [
      { name: 'Danish', key: 1 },
      { name: 'English', key: 2 }
    ];

    if($routeParams.id) {
      $scope.edit = true;
      $scope.item = Item.get({ id: $routeParams.id }, function(res) {
        $scope.item.scheduled = new Date($scope.item.scheduled);
        $scope.isScheduled = (new Date() < $scope.item.scheduled);
        // FIXME: Channels are not preselected
      }, function(err) {
        console.error(err);
      });
    }

    $scope.publish = function() {
      $scope.prepareData();
      Items.save($scope.item, function(res) {
      }, function(err) {
        console.error(err);
      });
    };

    $scope.update = function() {
      $scope.prepareData();
      Item.update({ id: $routeParams.id }, $scope.item, function(res) {
      }, function(err) {
        console.error(err);
      });
    };

    $scope.upload = function(file) {
      Upload.upload({
        url: '/upload',
        data: { item: file }
      }).then(function(res) {
        $scope.item.content.media = {
          fileName: res.data,
          fileUrl: 'http://localhost:3000/images/' + res.data,
          url: 'http://localhost:3000/images/' + res.data
        };
      }, function(err) {
        console.error(err);
      });
    };

    $scope.remove = function() {
      // TODO: Delete the image from the server
      $scope.item.content.media = { fileName: null, fileUrl: null, url: null };
    };

    $scope.prepareData = function() {
      if($scope.item.tags)
        $scope.item.tags = $scope.item.tags.map(tag => tag.text);
    };
  }
]);
