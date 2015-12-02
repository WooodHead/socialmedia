/**
 * Allows managing social media content on different networks
 *
 * @namespace Modules
 */
(function() {
  angular.module('SocialMedia', [
    'SocialMedia.Core',
    'SocialMedia.Calendar',
    'SocialMedia.Publish',
    'ngRoute',
  ]
  );
})();
