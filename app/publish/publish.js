app.controller('PublishCtrl', function($scope, $routeParams, Channels, Countries, Regions, Cities, Languages, Items, Item, Upload) {
    $scope.item = { content: { media: { } }, channels: [], geo: { } };
    $scope.today = new Date();
    $scope.networks = ['Facebook', 'Twitter', 'Google+'];
    $scope.channels = Channels.get({}, function(res) { $scope.setTickedChannels(); });
    $scope.countries = Countries.get({});
    $scope.regions = Regions.get({});
    $scope.cities = Cities.get({});
    $scope.languages = Languages.get({});

    $scope.localLang = {
      selectAll: 'Select all',
      selectNone: 'Select none',
      reset: 'Reset',
      search: 'Search...',
      nothingSelected: 'Nothing is selected'
    };

    $scope.channelsText = JSON.parse(JSON.stringify($scope.localLang)); $scope.channelsText.nothingSelected = 'Channels';
    $scope.countriesText = JSON.parse(JSON.stringify($scope.localLang)); $scope.countriesText.nothingSelected = 'Countries';
    $scope.regionsText = JSON.parse(JSON.stringify($scope.localLang)); $scope.regionsText.nothingSelected = 'Regions';
    $scope.citiesText = JSON.parse(JSON.stringify($scope.localLang)); $scope.citiesText.nothingSelected = 'Cities';
    $scope.languagesText = JSON.parse(JSON.stringify($scope.localLang)); $scope.languagesText.nothingSelected = 'Languages';


    if($routeParams.id) {
      $scope.edit = true;
      $scope.item = Item.get({ id: $routeParams.id }, function(res) {
        $scope.item.scheduled = new Date($scope.item.scheduled);
        $scope.isScheduled = (new Date() < $scope.item.scheduled);
        $scope.setTickedChannels();
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

      if($scope.item.channels)
        $scope.item.channels = $scope.item.channels.map(channel => channel._id);
    };

    $scope.setTickedChannels = function() {
      console.log($scope.channels, $scope.item.channels);
      $scope.channels.forEach(function(channel) {
        channel.ticked = $scope.item.channels.filter(x => x === channel._id).length === 1;
      });
    };
  }
);
