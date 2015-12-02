/**
 * Synchronizes a model with the server via socket.io and optionally filters it
 *
 * @namespace Factories
 */
(function() {
  angular
    .module('SocialMedia.Calendar')
    .factory('syncer', syncer);

  function syncer(socket) {
    var config = {
      model: null,
      filter: null,
      emit: null,
    };

    return {
      initialize: activate,
      filter: filter,
      subscribeWeek: subscribeWeek,
      subscribeMonth: subscribeMonth,
      removeSubscriptions: removeSubscriptions,
    };

    /**
     * Initializes the factory
     *
     * @param {object} model - The model to sync
     * @param {object} filter - The filter which will be applied when the filter method is called
     * @param {function} onUpdate - The function to call when an update happened
     */
    function activate(model, filter, onUpdate) {
      config.model = model;
      config.filter = filter;
      config.emit = onUpdate;
    }

    /**
     * Returns the filtered model
     */
    function filter() {
      return config.model.filter(function filterItems(item) {
        return filterItem(item);
      });
    }

    /**
     * Subscribes for events from the server for the given week
     *
     * @param {number} - the week to subscribe to
     */
    function subscribeWeek(week) {
      socket.on('items:week:' + week + ':new', onNewItem);
      socket.on('items:week:' + week + ':edit', onItemUpdate);
      socket.on('items:week:' + week + ':delete', onItemDelete);
    }

    /**
     * Subscribes for events from the server for the given month
     *
     * @param {number} - the month to subscribe to
     */
    function subscribeMonth(month) {
      socket.on('items:month:' + month + ':new', onNewItem);
      socket.on('items:month:' + month + ':edit', onItemUpdate);
      socket.on('items:month:' + month + ':delete', onItemDelete);
    }

    /**
     * Removes all listener for the given week and month
     *
     * @param {number} week - the week to unsubscribe to
     * @param {number} month - the month to unsubscribe to
     */
    function removeSubscriptions(week, month) {
      socket.removeAllListeners('items:month:' + month + ':new');
      socket.removeAllListeners('items:month:' + month + ':edit');
      socket.removeAllListeners('items:month:' + month + ':delete');

      socket.removeAllListeners('items:week:' + week + ':new');
      socket.removeAllListeners('items:week:' + week + ':edit');
      socket.removeAllListeners('items:week:' + week + ':delete');
    }

    function filterItem(item) {
      return filterNetwork(item) && filterChannels(item);
    }

    function filterNetwork(item) {
      for (var i = 0; i < config.filter.networks.length; i++) {
        if (config.filter.networks[i].name === item.content.network)
          return true;
      }

      return false;
    }

    function filterChannels(item) {
      for (var i = 0; i < config.filter.channels.length; i++) {
        for (var k = 0; k < item.channels.length; k++) {
          var id = angular.isObject(item.channels[k]) ? item.channels[k]._id : item.channels[k];
          if (config.filter.channels[i]._id === id) { return true; }
        }
      }

      return false;
    }

    function onNewItem(item) {
      if (!filterItem(item)) return;
      config.model.push(item);
      config.emit();
    }

    function onItemUpdate(item) {
      if (!filterItem(item)) return;
      var index = indexOfItem(item._id);

      if (index !== null) {
        config.model[index] = item;
        config.emit();
      }
    }

    function onItemDelete(item) {
      if (!filterItem(item)) return;
      var index = indexOfItem(item._id);
      if (index !== null) {
        config.model.splice(index, 1);
        config.emit();
      }
    }

    function indexOfItem(id) {
      for (var i = 0; i < config.model.length; i++)
        if (config.model[i]._id === id)
          return i;

      return null;
    }
  }
})();
