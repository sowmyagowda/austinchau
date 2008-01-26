// DELETE EVENT

var feedUri = 'http://www.google.com/calendar/feeds/default/private/full';

// find the event with matching text to delete
var searchText = 'test';

var query = new google.gdata.calendar.CalendarEventQuery(feedUri);
query.setFullTextQuery(searchText);

calendarService.getEventsFeed(
  query, 
  function(root) {
    var entries = root.feed.getEntries();
    
    //delete the first matched event
    if (entries.length > 0) {
      entries[0].deleteEntry(
        function() {
          printToOutput('event is deleted');
        },
        handleError
      );
    }
  }, 
  handleError
);