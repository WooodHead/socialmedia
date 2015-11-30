(function() {
  createRestifyResource('v1', 'item', 'items');
  createRestifyResource('v1', 'channel', 'channels');
  createRestifyResource('v1', 'country', 'countries');
  createRestifyResource('v1', 'region', 'regions');
  createRestifyResource('v1', 'city', 'cities');
  createRestifyResource('v1', 'language', 'languages');

  function createRestifyResource(version, singular, plural) {
    angular
      .module('SocialMedia')
      .factory(plural + 'Service', ['$resource', createPluralResource]);
    angular
      .module('SocialMedia')
      .factory(singular + 'Service', ['$resource', createSingularResource]);

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
