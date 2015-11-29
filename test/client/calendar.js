var Publisher = require('./models/edit');
var Calendar = require('./models/calendar');

describe('Calendar', function() {
  describe('should sync via socket.io', function() {
    var calendar = Calendar.attach(browser.forkNewDriverInstance());
    var publisher = Publisher.attach(browser);
    var publishedEventId = null;
    var publishedEvent = null;
    var updatedEvent = null;

    it('when a new item is created', function() {
      calendar.navigate(new Date());
      publisher.browser().get('#/publish/');

      publisher.setChannel(0);
      publisher.setNetwork('Twitter');
      publisher.setMessage('Created by Protractor on ' + (new Date).toString());
      publisher.publish();

      publishedEvent = calendar.getEvent(publisher.getId());
      expect(publishedEvent.isPresent()).toBe(true);
    });

    it('when an item is updated', function() {
      publisher.getId().then(function(id) {
        publisher.browser().get('#/edit/' + id);
        publisher.setMessage('Updated by Protractor');
        publisher.update();

        updatedEvent = calendar.getEvent(publisher.getId());
        expect(calendar.getMessage(updatedEvent)).toBe('Updated by Protractor');
      });
    });

    it('when an item is deleted', function() {
      publisher.getId().then(function(id) {
        publisher.browser().get('#/edit/' + id);
        publisher.delete();

        updatedEvent = calendar.getEvent(publisher.getId());
        expect(publishedEvent.isPresent()).toBe(false);
      });
    });
  });
});
