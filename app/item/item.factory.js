(function() {
  createRestifyResource(app, 'v1', 'Item', 'Items');
  createRestifyResource(app, 'v1', 'Channel', 'Channels');
  createRestifyResource(app, 'v1', 'Country', 'Countries');
  createRestifyResource(app, 'v1', 'Region', 'Regions');
  createRestifyResource(app, 'v1', 'City', 'Cities');
  createRestifyResource(app, 'v1', 'Language', 'Languages');

  function createRestifyResource(app, version, singular, plural) {
    app.factory(plural, ['$resource', function($resource) {
      return $resource('/api/' + version + '/' + plural.toLowerCase() + '?populate=channels', [], {
        get: { method: 'GET', isArray: true }
      });
    }]);

    app.factory(singular, ['$resource', function($resource) {
      return $resource('/api/' + version + '/' + plural.toLowerCase() + '/:id', [], {
        update: { method: 'PATCH' }
      });
    }]);
  }
})();
