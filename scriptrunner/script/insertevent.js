// INSERT EVENT

var feedUri = 'http://www.google.com/calendar/feeds/default/private/full';

var title = 'test';
var where = 'here';
var content = 'blah';
var startTime = '2007-11-06T18:00:00.000Z';     
var endTime = '2007-11-06T19:00:00.000Z';

var newEvent = new google.gdata.calendar.CalendarEventEntry({
  title: {type: 'text', text: title},
  content: {type: 'text', text: content},
  locations: [
    {
      rel: 'g.event',
      label: 'Event location',
      valueString: where
    }],
  times: [
    {
      startTime:
          google.gdata.DateTime.fromIso8601(startTime),
      endTime:
          google.gdata.DateTime.fromIso8601(endTime)
    }]
  }
);        

calendarService.getEventsFeed(
  feedUri, 
  function(root) {
    root.feed.insertEntry(
      newEvent,
      function(root) {
        printToOutput('event is inserted!');
      },
      handleError
    );      
  }, 
  handleError
); 