// LIST ALL EVENTS

var feedUri = 'http://www.google.com/calendar/feeds/default/private/full';

var callback = function(root) {       
  
  var entries = root.feed.getEntries();       
        
  for (var i=0;i<entries.length ;i++ ) {
    var entry = entries[i];
    var eventTitle = entry.getTitle().getText();
    PRINT(eventTitle);
    PRINT('<br>');
  }    
}

calendarService.getEventsFeed(
  feedUri, callback, handleError
);