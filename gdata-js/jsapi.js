(function() {
  var SCOPE_URL = 'http://www.google.com/calendar/feeds/';
  var FEED_URL = 'http://www.google.com/calendar/feeds/default/private/full';
  var calendarService = null;

  google.load('gdata', '1.x');
  google.setOnLoadCallback(init);

  function init() {

    if (isTokenRedirect()) {
      $('body').css({visibility: 'hidden'});
      return;
    }


    calendarService =
      new google.gdata.calendar.CalendarService('Calendar_JS_Guide');

    $('#login').click(function() {
      if (hasCalendarToken()) {
        google.accounts.user.logout();
        $('#login').val('login');
        enableButtons(false);
      } else {
        google.accounts.user.login(SCOPE_URL);
      }
    });

    if (hasCalendarToken()) {

      enableButtons(true);
      $('#login').val('logout');
      setDisplay(
          'token = ' +
          google.accounts.user.checkLogin(SCOPE_URL));
    } else {
      enableButtons(false);
      $('#login').val('login');
      setDisplay('no token');
    }

    $('#privaterun').click(function() {
      getAllEvents(); 
    });

    $('#publicrun').click(function() {
  
    });

  }  

  function getAllEvents() {

    calendarService.getEventsFeed(
      FEED_URL, 
      function(root) {
           
        var entries = root.feed.getEntries();        
        
        var output = [];
            
        for (var i=0;i<entries.length ;i++ ) {
          var entry = entries[i];

          var eventTitle = entry.getTitle().getText();
          var eventLocation = entry.getLocations()[0].getValueString();
          output.push('title = ' + eventTitle);
          output.push('<br>');

        }    
        output = output.join('');
        setDisplay(output);
      }, 
      handleError
    );  
  }

  function setDisplay(text) {
    $('#display').html(text);
  }


  function enableButtons(bool) {

    $('#buttons input[type="button"]').each(function() {
      //$(this).get(0).disabled = !bool;
      $(this).attr({disabled: !bool});
    });
  }

  function hasCalendarToken() {
    if (google.accounts.user.checkLogin(SCOPE_URL) === '') {
      return false;
    }
    return true;
  }

  function isTokenRedirect() {

    var status = false;
    var url = window.location.href;
    var matchArr = url.match(/#2/);

    if (matchArr != null) {
      status = true;
    }

    return status;
  }

  function handleError(e) {

    e.cause ? e.cause.statusText : e.message;
    setDisplay(e.cause);
    //alert("There was an error!");
    //alert(;
  }

})();
