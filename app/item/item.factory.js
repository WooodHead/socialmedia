(function() {
  createRestifyResource('v1', 'Item', 'Items');
  createRestifyResource('v1', 'Channel', 'Channels');
  createRestifyResource('v1', 'Country', 'Countries');
  createRestifyResource('v1', 'Region', 'Regions');
  createRestifyResource('v1', 'City', 'Cities');
  createRestifyResource('v1', 'Language', 'Languages');

  function createRestifyResource(version, singular, plural) {
    angular
      .module('SocialMedia')
      .factory(plural, ['$resource', createPluralResource]);
    angular
      .module('SocialMedia')
      .factory(singular, ['$resource', createSingularResource]);

    function createPluralResource($resource) {
      return $resource('/api/' + version + '/' + plural.toLowerCase() + '?populate=channels', [], {
        get: { method: 'GET', isArray: true }
      });
    }

    function createSingularResource($resource) {
      return $resource('/api/' + version + '/' + plural.toLowerCase() + '/:id', [], {
        update: { method: 'PATCH' }
      });
    }
  }
})();
