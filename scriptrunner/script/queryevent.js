// QUERY EVENT

var searchText = 'test';

var feedUri = 'http://www.google.com/calendar/feeds/default/private/full';

var query = new google.gdata.calendar.CalendarEventQuery(feedUri);
query.setFullTextQuery(searchText);

var callback = function(root) {
  var entries = root.feed.getEntries();

  for (var i=0;i<entries.length ;i++ ) {
    var entry = entries[i];
    PRINT('event title: ' + entry.getTitle().getText());
  }
}

calendarService.getEventsFeed(
  query, callback, handleError
);