app.controller('PublishCtrl', ['$scope', 'ItemsFactory', function($scope, ItemsFactory) {
  $scope.networks = ['Facebook', 'Twitter', 'Instagram', 'Google+'];
  $scope.channels = [
    { name: 'Lovely cats', id: 1 },
    { name: 'Kitkat', id: 2 }
  ];
  $scope.countries = [
    { value: 'Denmark', key: 1 },
    { value: 'Afghanistan', key: 134},
    { value: 'Afrikaans', key: 31 }
  ];

  $scope.languages = [
    { value: 'Danish', key: 1 },
    { value: 'German', key: 2},
    { value: 'English', key: 3 }
  ];

  $scope.cities = [
    { value: 'Copenhagen', key: 1 },
    { value: 'Cologne', key: 2},
    { value: 'Vienna', key: 3 }
  ];

  $scope.regions = [
    { value: 'Bavaria', key: 1 },
    { value: 'Britania', key: 2},
    { value: 'Ruhr', key: 3 }
  ];

  $scope.channelSelectSettings = {
    displayProp: 'name',
    externalIdProp: '',
    smartButtonMaxItems: 3,
    showCheckAll: false,
    showUncheckAll: false
  };

  $scope.geoSelectSettings = {
    displayProp: 'value',
    idProp: 'key',
    externalIdProp: '',
    smartButtonMaxItems: 3,
  };

  $scope.item = {
    content: { network: $scope.networks[0], media: {} },
    geo: { countries: [], languages: [], cities: [], regions: [] },
    status: 'Draft',
    channels: []
  };

  $scope.uploaded = function(res) {
    $scope.item.content.media = {
      fileName: res.data,
      fileUrl: 'http://localhost:3000/images/' + res.data,
      url: 'http://localhost:3000/images/' + res.data,
    };
  };

  $scope.publish = function() {
    $scope.item.tags = $scope.item.tags.map(x => x.text);

    ItemsFactory.save($scope.item, function (res) {
      console.log(res);
    }, function(err) {
      console.error(err);
    })
  };
}]);
